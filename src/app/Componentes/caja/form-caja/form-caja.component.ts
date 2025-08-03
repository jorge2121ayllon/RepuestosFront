import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Caja } from 'src/app/Models/caja';
import { CajaService } from 'src/app/Services/caja/caja.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-caja.component.html',
  styleUrls: ['./form-caja.component.css']
})
export class FormCajaComponent implements OnInit{
  form!: FormGroup;
  caja: Caja = new Caja;
  valor: any
  visibilidadCierre=false;
  visibilidadApertura=true;
  constructor(private router: Router,private toastr: ToastrService,public dialog: MatDialog, public dialogRef: MatDialogRef<Caja>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: CajaService) {
  }
  ngOnInit(): void {
    this.inicializarForm();
    if(this.data.id>0 && this.data.tipo!=3){
      this.cargarFormEditar(this.data.obj);
    }
  }
  agregar(){
    this.caja=this.form.value;
    this.valor = this.form.value.apertura
    if(localStorage.getItem('cajaAbierta')=='cerrada'){
      this.service.open(this.caja).subscribe((r: any) => {
        localStorage.setItem('idCaja',r.data.id)
        localStorage.setItem('CantidadCajaActual',this.valor)
        this.toastr.success("Caja agregada.")
        localStorage.setItem('cajaAbierta','abierta')
        this.dialogRef.close();
      });
    }else{
      this.toastr.error("No puede abrir nuevamente una caja mientras no se haya cerrado")
      this.dialogRef.close();
    }
   }
   actualizar(){
    this.caja=this.form.value;
    this.caja.id=this.data.id;
    this.service.close(this.caja).subscribe((resp:any) => {
      this.dialogRef.close();
      this.toastr.success("Caja actualizada.")
     });
   }
  inicializarForm(){
    this.form = new FormGroup({
      apertura: new FormControl('',Validators.required),
      cierre: new FormControl(''),
    });
  }

  cargarFormEditar(obj:any){
    this.visibilidadCierre=true;
    this.visibilidadApertura=true;
    this.form.controls['apertura'].setValue(obj.apertura);
    this.form.controls['cierre'].setValue(obj.cierre);
  }

  guardar(){
      if(this.data.id>0 && this.data.tipo===2) 
      { 
        this.actualizar();
      }
      if(this.data.id===0){
        this.agregar();
        this.router.navigate(['/venta'])
      }
    }
}
