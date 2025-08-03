
import { Input, Component,OnInit, Output, EventEmitter } from '@angular/core';
import { Login } from 'src/app/Models/login';
import { LoginService } from 'src/app/Services/login/login.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from 'src/app/Services/caja/caja.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup
  load: boolean= true;
  objLogin!:Login;
  hide = true;

  constructor(private cajaService:CajaService,private fb : FormBuilder,private toastr: ToastrService,private service:LoginService, private router: Router) {
    this.form = this.fb.group({
      usuario: ['',Validators.required],
      Password: ['',Validators.required]
    })
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  login() {
    this.load=false;
    if (this.form.valid) {
      this.objLogin=this.form.value;
      this.service.login(this.objLogin).subscribe((resp: any) => {
        this.toastr.success("Bienvenido "+this.form.value.usuario)
        localStorage.setItem('idUser',resp.id);
        localStorage.setItem('token',resp.token);
        localStorage.setItem('nombreUsuario',resp.nombreUsuario);
        localStorage.setItem('role',resp.role);
        this.cajaService.getCajaAbierta().subscribe((caja:any)=>{
          if(caja){
            localStorage.setItem('cajaAbierta','abierta')
          }else{ 
            localStorage.setItem('cajaAbierta','cerrada')
          }
        })
        if(resp.role=="admin"){
          this.router.navigate(['reporte']);  
        }else{
          //si el cajero no tiene una caja abierta activa no podra realizar ventas
          if(localStorage.getItem('cajaAbierta')==='abierta'){
            this.router.navigate(['venta']);  
          }else{
            this.router.navigate(['caja']);
          }
        }
      },(error: any)=>{
        this.toastr.error("Ingreso mal sus datos, por favor intente de nuevo")

        this.objLogin=this.inicializarLogin();
      })
      this.load=true;
    }
  }
  inicializarLogin():Login{
    let login : Login = {
      usuario : '',
      Password : '',
    }
    this.form = this.fb.group({
      usuario: ['',Validators.required],
      Password: ['',Validators.required]
    })
    return login;
  }
}
