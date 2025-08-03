import { CompraCompraDetalle } from './../../Models/compra/CompraCompraDetalle';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PaginacionService } from './../paginacion.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/Models/General/response';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  baseUrl: string=environment.appUrl+'/api/compra';

  constructor(private http : HttpClient, private PaginacionService : PaginacionService) {

  }

  Lista(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/lista"+'?filter='+this.PaginacionService.Filtro.filter+
    '&PageSize='+this.PaginacionService.Filtro.PageSize+
    '&PageNumber='+this.PaginacionService.Filtro.PageNumber)
  }

  ListaProducto(filtro : string): Observable<Response>{
    return this.http.get<Response>(environment.appUrl+'/api/producto'+"/lista"+'?filter='+filtro+
    '&PageSize='+1000000+
    '&PageNumber='+0)
  }

  add(compra: CompraCompraDetalle): Observable<Response>{
    return this.http.post<Response>(this.baseUrl+"/agregar", JSON.stringify(compra), this.PaginacionService.httpOptions);
  }


   getcompra(Id: number): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/obtener" + "?id="+ Id);
  }

  deleteDetalle(compraId: number){
    return this.http.delete(environment.appUrl+'/api/detallecompra'+"/eliminar"+ "?id=" +compraId , this.PaginacionService.httpOptions);
  }

  delete(compraId: number){
    return this.http.delete(this.baseUrl+"/eliminar"+ "?id=" +compraId);
  }




  update(compra : any): Observable<Response>{
    return this.http.put<Response>(this.baseUrl+"/actualizar", JSON.stringify(compra), this.PaginacionService.httpOptions);
  }
}
