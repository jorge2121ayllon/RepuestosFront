import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Producto } from 'src/app/Models/Administration/producto';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
import { ProductoService } from 'src/app/Services/producto/producto.service';
import { CodigobarraComponent } from '../codigobarra/codigobarra.component';
@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.css']
})
export class FormproductoComponent implements OnInit {
  producto!: FormGroup;
  token!:any;//var para el token
  categorias!:any[];//var para la lista de categorias para el select
  labelPosition: 'before' | 'after' = 'before';//var para la posicion del label del checkbox
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<Producto>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: ProductoService, private serviceCategoria:CategoriaService) {
  }
  ngOnInit(): void {
    this.token=localStorage.getItem('token');
    this.inicializarForm();
     //para verifica si hay token 
     if(this.token!=null){
      this.cargarListaCategorias();
    }
    if(this.data.id>0){
    this.cargarFormEditar(this.data.obj);
    }
  }
  //metodo para guardar la categoria
  guardar(){
    if(this.validar()===true){
      if(this.data.id>0){
        this.actualizar();
      }else{
        this.agregar();
      }
    }
   }
   //metodo para inicializar el form
  inicializarForm(){
    this.producto = new FormGroup({
      Id:new FormControl(0),
      PrecioCompra: new FormControl('',[Validators.required, Validators.minLength(1)]),
      PrecioVenta: new FormControl('',[Validators.required, Validators.minLength(1)]),
      Marca: new FormControl(''),
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Stock: new FormControl('',[Validators.required, Validators.minLength(1)]),
      StockMinimo: new FormControl('',[Validators.required, Validators.minLength(1)]),
      Codigo: new FormControl(''),
      CodigoInterno: new FormControl(''),
      Code: new FormControl(false),
      Unidad: new FormControl(''),
      IdCategoria: new FormControl(0,[Validators.required])
    });
  }
  //metodo para cargar el form para editarlo
  cargarFormEditar(obj:any){
    this.producto.controls['Id'].setValue(obj.id)
    this.producto.controls['PrecioCompra'].setValue(obj.precioCompra)
    this.producto.controls['PrecioVenta'].setValue(obj.precioVenta)
    this.producto.controls['Marca'].setValue(obj.marca)
    this.producto.controls['Descripcion'].setValue(obj.descripcion)
    this.producto.controls['Stock'].setValue(obj.stock)
    this.producto.controls['StockMinimo'].setValue(obj.stockMinimo)
    this.producto.controls['Codigo'].setValue(obj.codigo)
    this.producto.controls['CodigoInterno'].setValue(obj.codigoInterno)
    this.producto.controls['Unidad'].setValue(obj.unidad)
    this.producto.controls['IdCategoria'].setValue(obj.idCategoria)
  }
  //metodo para cargar la lista de categorias hijas para el select
cargarListaCategorias(){
  this.serviceCategoria.listaPadres(false).subscribe((resp:any) => {
    this.categorias=resp.data;
  })
}

validarCodigo(codigo:any){

}

agregar(){
  this.service.agregar(this.producto.value,this.token).subscribe((resp:any) => {
    this.openDialogCodigoBarra(resp.data);
    this.dialogRef.close();
    //alert("se guardo el producto con exito")
   })
}
actualizar(){
  this.service.actualizar(this.producto.value,this.token).subscribe((resp:any) => {
    this.openDialogCodigoBarra(resp.data);
    this.dialogRef.close();
    //alert("se actualizo el producto con exito")
   })
}

validar(){
  console.log(this.producto.value)
  var retorno=false;
    if(this.producto.get('IdCategoria')!.value===0){
      retorno=false;
      return retorno;
    }else{
      retorno =true;
    }
    if(this.producto.get('PrecioCompra')!.value===0){
      retorno=false;
      return retorno;
    }else{
      retorno =true;
    }
    if(this.producto.get('PrecioVenta')!.value===0){
      retorno=false;
      return retorno;
    }else{
      retorno =true;
    }
    if(this.producto.get('Stock')!.value===0){
      retorno=false;
      return retorno;
    }else{
      retorno =true;
    }
    if(this.producto.get('StockMinimo')!.value===0){
      retorno=false;
      return retorno;
    }else{
      retorno =true;
    }
    if(this.producto.get('Code')!.value===false){
      if(this.producto.get('Codigo')!.value===""){
        retorno=false;
        return retorno;
      }
    }
  return retorno;
}

actualizarCodigo(){
  if(this.producto.get('Codigo')!.value){
    this.producto.controls['Codigo'].setValue('');
  }
}

openDialogCodigoBarra(obj:any) {
    const dialogRef =this.dialog.open(CodigobarraComponent, {
      data: {obj: obj},
    });
  }
}
