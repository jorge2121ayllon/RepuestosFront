import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaginacionService } from '../paginacion.service';
@Injectable({
  providedIn: 'root'
})
export class StockService {
//Base para conexion proxy
baseUrl = environment.appUrl+'/api/Producto';
  constructor(private http : HttpClient,private PaginacionService : PaginacionService) { }
  lista(tipo:boolean){
    let url = this.baseUrl + '/stock'+
    '?filter='+this.PaginacionService.Filtro.filter+
    '&PageSize='+this.PaginacionService.Filtro.PageSize+
    '&PageNumber='+this.PaginacionService.Filtro.PageNumber+
    '&tipo='+tipo;
    return this.http.get( url);
    }
    listaDate(dias:number){
      let url = this.baseUrl + '/stockDate'+
      '?filter='+this.PaginacionService.Filtro.filter+
      '&PageSize='+this.PaginacionService.Filtro.PageSize+
      '&PageNumber='+this.PaginacionService.Filtro.PageNumber+
      '&dias='+dias;
      return this.http.get(url);
    }
    listaDetalle(){
console.log(this.PaginacionService.FiltroStock.IdCategoria)
      var precioCompra=this.PaginacionService.FiltroStock.PrecioCompra;
      var precioVenta=this.PaginacionService.FiltroStock.PrecioVenta;
      var marca=this.PaginacionService.FiltroStock.Marca;
      var descripcion=this.PaginacionService.FiltroStock.Descripcion;
      var stock=this.PaginacionService.FiltroStock.Stock;
      var stockMinimo=this.PaginacionService.FiltroStock.StockMinimo;
      var codigo=this.PaginacionService.FiltroStock.Codigo;
      //var fechaMovimiento=this.PaginacionService.FiltroStock.FechaMovimiento;
      var idCategoria=this.PaginacionService.FiltroStock.IdCategoria;
      var CategoriaPadre=this.PaginacionService.FiltroStock.CategoriaPadre;
      var unidad=this.PaginacionService.FiltroStock.Unidad;


      let url = this.baseUrl + '/stockDetalle'+
      '?PrecioCompra='+precioCompra+
      '&PrecioVenta='+precioVenta+
      '&Marca='+marca+
      '&Descripcion='+descripcion+
      '&Stock='+stock+
      '&StockMinimo='+stockMinimo+
      '&Codigo='+codigo+
      //'&FechaMovimiento='+fechaMovimiento+
      '&IdCategoria='+idCategoria+
      '&CategoriaPadre='+CategoriaPadre+
      '&Unidad='+unidad+
      '&PageSize='+this.PaginacionService.FiltroStock.PageSize+
      '&PageNumber='+this.PaginacionService.FiltroStock.PageNumber;
      return this.http.get( url);
      }
}
