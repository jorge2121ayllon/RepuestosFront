import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Categoria } from 'src/app/Models/Administration/categoria';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
@Component({
  selector: 'app-formcategoria',
  templateUrl: './formcategoria.component.html',
  styleUrls: ['./formcategoria.component.css']
})
export class FormcategoriaComponent implements OnInit {
  categoria!: FormGroup;
  token!:any;//var para el token
  categorias!:any[];//var para la lista de categorias para el select
  labelPosition: 'before' | 'after' = 'before';//var para la posicion del label del checkbox
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<Categoria>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: CategoriaService) {
  }
  ngOnInit(): void {
      this.inicializarForm();
      this.cargarLista();
    if(this.data.id>0){
    this.cargarFormEditar(this.data.obj);
    }
  }
  //metodo para guardar la categoria
  guardar(){
    if(this.validarCategoria()===true){
      if(this.data.id>0){
        this.actualizar();
      }else{
        this.agregar();
      }
    }
   }
   //metodo para inicializar el form
  inicializarForm(){
    this.categoria = new FormGroup({
      Id:new FormControl(0),
      Nombre: new FormControl('',[Validators.required, Validators.minLength(2)]),
      Descripcion: new FormControl('', Validators.required),
      Padre: new FormControl(false, Validators.required),
      IdCategoria: new FormControl(0)
    });
  }
  //metodo para cargar el form para editarlo
  cargarFormEditar(obj:any){
    this.categoria.controls['Id'].setValue(obj.id)
    this.categoria.controls['Nombre'].setValue(obj.nombre)
    this.categoria.controls['Descripcion'].setValue(obj.descripcion)
    this.categoria.controls['Padre'].setValue(obj.padre)
    this.categoria.controls['IdCategoria'].setValue(obj.idCategoria)
  }
  //metodo para cargar la lista de categorias padres para el select
cargarLista(){
  this.service.listaPadres(true).subscribe((resp:any) => {
    this.categorias=resp.data;
  })
}
actualizarCategoria(){
  if(this.categoria.get('Padre')!.value){
    this.categoria.controls['IdCategoria'].setValue(0);
  }
}
validarCategoria(){
  var retorno=false;
  if(this.categoria.get('Padre')!.value){
      retorno=true;
  }
  if(this.categoria.get('Padre')!.value===false){
    if(this.categoria.get('IdCategoria')!.value===0){
      retorno=false;
    }else{
      retorno =true;
    }
  }
  return retorno;
}
agregar(){
  this.service.agregar(this.categoria.value,this.token).subscribe((resp:any) => {
    this.dialogRef.close();
    alert("se guardo la categoria con exito")
   })
}
actualizar(){
  this.service.actualizar(this.categoria.value,this.token).subscribe((resp:any) => {
    this.dialogRef.close();
    alert("se actualizo la categoria con exito")
   })
}
}
