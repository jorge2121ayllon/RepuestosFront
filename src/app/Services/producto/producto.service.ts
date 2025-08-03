import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaginacionService } from '../paginacion.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
//Base para conexion proxy
baseUrl = environment.appUrl+'/api/Producto';
  constructor(private http : HttpClient,private PaginacionService : PaginacionService) { }
  lista(token:string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let url = this.baseUrl + '/lista'+'?filter='+this.PaginacionService.Filtro.filter+
    '&PageSize='+this.PaginacionService.Filtro.PageSize+
    '&PageNumber='+this.PaginacionService.Filtro.PageNumber;
    return this.http.get( url,{headers : httpHeaders});
    }
  //servicio para agregar la categoria
  agregar(obj:any,token:string){
   //Cargando token JWT
   const httpHeaders = new HttpHeaders({
    'Content-type' : 'application/json',
    'Authorization': `Bearer ${token}`
    });
  let url = this.baseUrl + '/agregar';
  return this.http.post( url,obj,{headers : httpHeaders});
  }
  actualizar(obj:any,token:string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
     'Content-type' : 'application/json',
     'Authorization': `Bearer ${token}`
     });
   let url = this.baseUrl + '/actualizar';
   return this.http.put( url,obj,{headers : httpHeaders});
   }
   eliminar(id:number,token:string){
    //Cargando token JWT
    const httpHeaders = new HttpHeaders({
     'Content-type' : 'application/json',
     'Authorization': `Bearer ${token}`
     });
   let url = this.baseUrl + '/eliminar'+'?id='+id;
   return this.http.delete( url,{headers : httpHeaders});
   }

   
}
