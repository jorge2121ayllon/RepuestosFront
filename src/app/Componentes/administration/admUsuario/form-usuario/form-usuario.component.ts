import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Usuario } from 'src/app/Models/Administration/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ToastrService } from 'ngx-toastr';

interface Roles {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit{
  form!: FormGroup;
  usuario: Usuario = new Usuario;
  visibilidadClave=false;
  labelPosition: 'before' | 'after' = 'before';
  roless: Roles[] = [
    {value: 'admin', viewValue: 'Administrador'},
    {value: 'cajero', viewValue: 'Cajero'}
  ];
  constructor(private toastr: ToastrService,public dialog: MatDialog, public dialogRef: MatDialogRef<Usuario>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: UsuarioService) {
  }
  ngOnInit(): void {
    this.inicializarForm();
    if(this.data.id>0){
      this.cargarFormEditar(this.data.obj);
    }
  }
  agregar(){
    this.usuario=this.form.value;
    this.service.add(this.usuario).subscribe((r) => {
      this.dialogRef.close();
      this.toastr.success("Usuario "+'"'+this.usuario.nombreUsuario+'"'+" agregado.")
    },(error: any)=>{
      this.toastr.error("El nombre de usuario o correo ya existe por favor intente con otro.")
    })
   }
   actualizar(){
    this.usuario=this.form.value;
    this.usuario.id=this.data.id;
    this.service.put(this.usuario).subscribe((r) => {
      this.dialogRef.close();
      this.toastr.success("Usuario "+'"'+this.usuario.nombreUsuario+'"'+" actualizado.")
     },(error: any)=>{
      this.toastr.error("El nombre de usuario o correo electrónico ya existe por favor intente con otro.")
    })
   }

  inicializarForm(){
    this.form = new FormGroup({
      nombreUsuario: new FormControl('',[Validators.required, Validators.minLength(3)]),
      rol: new FormControl('', Validators.required),
      gmail: new FormControl('', [Validators.required,Validators.email]),
      clave: new FormControl('', [Validators.required,Validators.minLength(8)]),
      cambiarClave: new FormControl(true),
    });
  }

  cargarFormEditar(obj:any){
    this.form.controls['nombreUsuario'].setValue(obj.nombreUsuario)
    this.form.controls['rol'].setValue(obj.rol)
    this.form.controls['gmail'].setValue(obj.gmail)
    this.visibilidadClave=true;
  }
  validarClave(){
    this.actualizarValidatorClave();
  }
  actualizarValidatorClave(){
      if(this.form.get('cambiarClave')!.value===false){
          this.form.controls["clave"].clearValidators();
          this.form.controls["clave"].updateValueAndValidity();
        }else{
          this.form.controls["clave"].setValidators([Validators.required,Validators.minLength(8)]);
        }
  }
  guardar(){
      if(this.data.id>0){
        this.actualizar();
      }else{
        this.agregar();
      }
    }
}
