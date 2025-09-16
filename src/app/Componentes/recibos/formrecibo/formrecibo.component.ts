import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/Models/Administration/categoria';
import { Recibo } from 'src/app/Models/venta/recibo';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
import { ReciboService } from 'src/app/Services/recibo/recibo.service';

@Component({
  selector: 'app-formrecibo',
  templateUrl: './formrecibo.component.html',
  styleUrls: ['./formrecibo.component.css']
})
export class FormreciboComponent {
recibo!: FormGroup;
  token!:any;//var para el token
  labelPosition: 'before' | 'after' = 'before';//var para la posicion del label del checkbox
  numeroVenta=0;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<Recibo>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: ReciboService) {
  }
  ngOnInit(): void {

      
      this.inicializarForm();
    if(this.data.id>0){
    this.cargarFormEditar(this.data.obj);
    this.numeroVenta=this.data.idVenta;
    }else{
      this.numeroVenta=this.data.obj;
      this.recibo.controls['IdVenta'].setValue(this.data.obj);
    }
  }
  //metodo para guardar el recibo
  guardar(){
      if(this.data.id>0){
        this.actualizar();
      }else{
        this.agregar();
      }
   }
   //metodo para inicializar el form
  inicializarForm(){
    this.recibo = new FormGroup({
      Id:new FormControl(''),
      Cliente: new FormControl('',[Validators.required, Validators.minLength(2)]),
      Descripcion: new FormControl(''),
      TipoPago: new FormControl('efectivo', Validators.required),
      Efectivo: new FormControl(true, Validators.required),
      Total: new FormControl('', Validators.required),
      IdVenta: new FormControl('', Validators.required),
    });
  }
  //metodo para cargar el form para editarlo
  cargarFormEditar(obj:any){
    this.recibo.controls['Id'].setValue(obj.id)
    this.recibo.controls['Cliente'].setValue(obj.cliente)
    this.recibo.controls['Descripcion'].setValue(obj.descripcion)
    this.recibo.controls['Total'].setValue(obj.total)
    this.recibo.controls['IdVenta'].setValue(obj.idVenta)
     this.recibo.controls['Efectivo'].setValue(obj.efectivo)
  }

agregar(){
  this.service.agregar(this.recibo.value,this.token).subscribe((resp:any) => {
    this.dialogRef.close(this.recibo.value.Total);
    alert("se guardo el recibo con exito")
   })
}
actualizar(){
  this.service.actualizar(this.recibo.value,this.token).subscribe((resp:any) => {
    this.dialogRef.close(this.recibo.value.Total);
    alert("se actualizo el recibo con exito")
   })
}

}
