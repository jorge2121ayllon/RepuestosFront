import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filtro } from '../Models/General/filtro';
import { FiltroStock } from '../Models/General/filtroStock';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {
  Filtro : Filtro = new Filtro;
  FiltroStock : FiltroStock = new FiltroStock;
  httpOptions ={
    headers: new HttpHeaders(
      {
          'Content-Type':'application/json; charset=utf-8',
      })
  };

  constructor() {
    this.Filtro.filter="";
    this.Filtro.PageNumber=1;
    this.Filtro.PageSize=5;

    //filtros de stock
    this.FiltroStock.PrecioCompra=0;
    this.FiltroStock.PrecioVenta=0;
    this.FiltroStock.Marca="";
    this.FiltroStock.Descripcion="";
    this.FiltroStock.Stock=0;
    this.FiltroStock.StockMinimo=0;
    this.FiltroStock.Codigo="";
    this.FiltroStock.CategoriaPadre=0;
    this.FiltroStock.IdCategoria=0;
    this.FiltroStock.Unidad="";
    this.FiltroStock.PageSize=1;
    this.FiltroStock.PageNumber=5;
   }
}
