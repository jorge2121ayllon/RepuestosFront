import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Login } from 'src/app/Models/login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
//Base para conexion proxy
  baseUrl = environment.appUrl+'/api/Token';
  httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json'
  })
  constructor(private http : HttpClient, private Router:Router) {
  }
  login(obj:Login){
    
    let url = this.baseUrl + '/token';
    return this.http.post( url,obj,{headers : this.httpHeaders});
  }
  getToken(){
    return localStorage.getItem('token');
  }
  getRole(){
    return localStorage.getItem('role')?.toUpperCase();
  }
  getUsuario(){
    return localStorage.getItem('nombreUsuario')?.toUpperCase();
  }
  loggedIn(){
    return !!localStorage.getItem('token');
  }
  getIdUser(){
    return localStorage.getItem('idUser');
  }
  loggedOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('role');
    localStorage.removeItem('idUSer');
    this.Router.navigate(['/']);
  }
  IsAdmin()
  {
    if(localStorage.getItem('role')=="admin"){
      return true
    }
    return false
  }
  IsCajero()
  {
    if(localStorage.getItem('role')=="cajero")
    {
      return true
    }
    return false
  }
}
