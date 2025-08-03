import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-permisos',
  templateUrl: './error-permisos.component.html',
  styleUrls: ['./error-permisos.component.css']
})
export class ErrorPermisosComponent {

constructor(private router: Router ){}
  
  atras(){
    if(localStorage.getItem("role")=="admin"){
      this.router.navigate(['reporte'])
    }
    if(localStorage.getItem("role")=="cajero"){
      this.router.navigate(['venta']);
    }else{
      this.router.navigate(['login']);
    }
  }
}
