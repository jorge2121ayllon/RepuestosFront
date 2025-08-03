import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from './../Models/Administration/usuario';
import { PaginacionService } from '../Services/paginacion.service';
import { Response } from 'src/app/Models/General/response';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  baseUrl: string='';
  constructor(private http: HttpClient,private PaginacionService : PaginacionService) {
    this.baseUrl=environment.appUrl+'/api/User'; 
   }
   add(u:Usuario){
      let url = this.baseUrl + '/agregar';
      return this.http.post(url, u);
   }
   put(u:Usuario){
    let url = this.baseUrl + '/actualizar';
    return this.http.put( url,u);
   }
   delete(id:number){
    let url = this.baseUrl + '/eliminar'+'?id='+id;
    return this.http.delete( url);
   }
   get(id:number){

   }
   lista(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/lista"+'?filter='+this.PaginacionService.Filtro.filter+
    '&PageSize='+this.PaginacionService.Filtro.PageSize+
    '&PageNumber='+this.PaginacionService.Filtro.PageNumber)
   }
}
