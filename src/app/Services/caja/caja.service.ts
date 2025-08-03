import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Caja } from '../../Models/caja';
import { PaginacionService } from '../paginacion.service';
import { Response } from 'src/app/Models/General/response';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
@Injectable({
  providedIn: 'root'
})
export class CajaService {
  baseUrl:  string=environment.appUrl+'/api/caja';
  inicio:any =null;
  fin:any = null;
  constructor(private authService: LoginService,private http: HttpClient, private Router:Router, private PaginacionService: PaginacionService) {

  }
   open(c:Caja){
      let url = this.baseUrl + '/agregar';
      c.idUser=Number(localStorage.getItem("idUser"));
      return this.http.post(url, c);
   }
   close(c:Caja){
    let url = this.baseUrl + '/cerrarCaja';
    return this.http.put(url,c);
   }
   update(c:Caja){
    let url = this.baseUrl + '/actualizarCaja';
    return this.http.put(url,c);
   }
   delete(id:number){
    let url = this.baseUrl + '/eliminar'+'?id='+id;
    return this.http.delete( url);
   }
   getCajaAbierta(){
      let url = this.baseUrl +'/unaCaja'
      return this.http.get(url)
   }
   lista(): Observable<Response>{
    if(this.authService.IsAdmin()){
      return this.http.get<Response>(this.baseUrl+"/lista"+'?filter='+this.PaginacionService.Filtro.filter+
      '&PageSize='+this.PaginacionService.Filtro.PageSize+
      '&PageNumber='+this.PaginacionService.Filtro.PageNumber+
      '&inicio='+this.inicio+
      '&fin='+this.fin)
    }else{
      var iduser= localStorage.getItem("idUser")
      return this.http.get<Response>(this.baseUrl+"/listaPorUsuarios"+'?filter='+this.PaginacionService.Filtro.filter+
      '&PageSize='+this.PaginacionService.Filtro.PageSize+
      '&PageNumber='+this.PaginacionService.Filtro.PageNumber+
      '&id='+iduser+
      '&inicio='+this.inicio+
      '&fin='+this.fin)
    }
   }
}
