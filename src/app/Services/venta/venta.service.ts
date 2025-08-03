import { Categoria } from './../../Models/Administration/categoria';
import { VentaVentaDetalle } from './../../Models/venta/ventaVentaDetalle';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginacionService } from '../paginacion.service';
import { Response } from 'src/app/Models/General/response';
import { Observable } from 'rxjs';
import { ReporteCaja } from 'src/app/Models/reporteCaja';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  months = [
    "","ENERO", "FEBRERO", "MARZO",
    "ABRIL", "MAYO", "JUNIO", "JULIO",
    "AGOSTO", "SEPTIEMBRE", "OCTUBRE",
    "NOVIEMBRE", "DICIEMBRE"
  ]


  baseUrl: string=environment.appUrl+'/api/venta';

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

  add(Venta:VentaVentaDetalle): Observable<Response>{
    return this.http.post<Response>(this.baseUrl+"/agregar", JSON.stringify(Venta), this.PaginacionService.httpOptions);
  }

  ReporteVentas(inicio: Date , fin: Date , Categoria : number): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/"+inicio+ "/"+fin+"/"+Categoria);
  }


  Reporte(tiempo: string): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/Reporte" + "?id="+ tiempo);
  }



   getVenta(Id: number): Observable<Response>{
    return this.http.get<Response>(this.baseUrl+"/obtener" + "?id="+ Id);
  }

  deleteDetalle(ventaId: number){
    return this.http.delete(environment.appUrl+'/api/detalleventa'+"/eliminar"+ "?id=" +ventaId , this.PaginacionService.httpOptions);
  }

  delete(ventaId: number){
    return this.http.delete(this.baseUrl+"/eliminar"+ "?id=" +ventaId);
  }


  update(Venta : any): Observable<Response>{
    return this.http.put<Response>(this.baseUrl+"/actualizar", JSON.stringify(Venta), this.PaginacionService.httpOptions);
  }


  ReporteCaja(obj : any ){
    var respuesta = this.http.get<Response>(this.baseUrl+"/ReporteCaja" + "?idCaja="+ obj.id);
    console.log()
    respuesta.subscribe(
      r=>{
        let reporte : ReporteCaja[] = [];
        reporte = r as any;

        let fechaapertura = new Date(obj.fechaApertura).toLocaleString("en-US");
        let fechacierre = new Date(obj.fechaCierre).toLocaleString("en-US");

        let vendido=obj.cierre - obj.apertura;
        let apertura= obj.apertura;
        let total = vendido + apertura;

        let reporteLista = "";
        reporte.forEach(element => {

          reporteLista = reporteLista+ "<tr><td>"+element.categoriaPadre+"</td><td>"+element.totalVendido+" Bs.</td><td>"+element.descuento+" Bs.</td> </tr>"
        });
        ;


        let imprimir=
        "<!doctype html><html lang='en'><head><meta charset='utf-8'><title>Almacen Digital</title><base href='/'><meta name='viewport' content='width=device-width, initial-scale=1'><link rel='icon' type='image/x-icon' href='favicon.ico'><link rel='preconnect' href='https://fonts.gstatic.com'><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'><link href='https://fonts.googleapis.com/css?family=Bungee Inline' rel='stylesheet' type='text/css'><link href='https://fonts.googleapis.com/css?family=Corinthia'rel='stylesheet' type='text/css'><link href='https://fonts.googleapis.com/css?family=Arbutus' rel='stylesheet' type='text/css'></head><body class='mat-typography'>"+
        "<style type='text/css'>"+
        "td{ text-align: center;}"+
        "th{ text-align: center;}"+
        "tr{ text-align: center;}"+
        ".table{width : 100%}"+
        "</style>"+
        "<h1  style='  text-align: center; font-size: xx-large; ; font-family: "+'Bungee Inline'+", sans-serif;' class='medio'>INVENTARIO</h1>"+
        "<table border style='width:100%'>"+
        "<TR><TH>Fecha Apertura</TH ><TH>Fecha Cierre</TH ><TH>Apertura Caja</TH ><TH >Total Vendido</TH ><TH >Total Caja</TH ></TR>"+
        "<tr><td>" + fechaapertura +"</td><td>" + fechacierre +"</td><td>" + apertura +" Bs.</td><td>"+vendido+" Bs.</td><td>"+total+" Bs.</td> </tr></table>"
        +"<br><table border style='width:100%'><TR><TH>Categoria</TH ><TH>Total Vendido</TH ><TH >Descuentos Realizados </TH ></TR>"+ reporteLista;



        //aqui imprime

        const WindowPrt = window.open();
        WindowPrt?.document.write(imprimir);


        setTimeout(() => {
          WindowPrt?.focus();
          WindowPrt?.print();
          WindowPrt?.close();
        }, 50);



      }
    )

  }


  imprimirFormato(venta : VentaVentaDetalle)
  {
    console.log(venta.detalleVenta)

    var date = new Date();
    var DateString = date.getDate() + ' de ' + this.months[date.getMonth()+1] + ' de ' + date.getFullYear();
    let lista ="";
    let descuento = "";

    if(venta.venta.descuento>0)
    { descuento =
    "<tr >"+
    "<th></th>"+
    "<th></th>"+
    "<th>Descuento</th>"+
    "<th>"+venta.venta.descuento+"</th></tr>"
    }


    venta.detalleVenta.forEach(element => {
      var subtotal2 = 0;
      if(element.descuento && element.subTotal)
      {
         subtotal2 = element.subTotal + element.descuento
      }
      else{
        if(element.subTotal)
         subtotal2 = element.subTotal
      }
      lista = lista + "<tr>"+"<td>"+element.idProducto+"</td>"+"<td>"+element.cantidad+"</td>"+"<td colspan='2'>"+element.producto+"</td>"+"<td>"+element.precioVenta+" Bs. </td>"+"<td>"+ subtotal2 +" Bs. </td>"+"<td>"+element.descuento+" Bs. </td>"+"<td>"+element.subTotal+" Bs. </td>"+"</tr>"
    });


    let imprimir=
    "<!doctype html><html lang='en'><head><meta charset='utf-8'><title>Almacen Digital</title><base href='/'><meta name='viewport' content='width=device-width, initial-scale=1'><link rel='icon' type='image/x-icon' href='favicon.ico'><link rel='preconnect' href='https://fonts.gstatic.com'><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'><link href='https://fonts.googleapis.com/css?family=Bungee Inline' rel='stylesheet' type='text/css'><link href='https://fonts.googleapis.com/css?family=Corinthia'rel='stylesheet' type='text/css'><link href='https://fonts.googleapis.com/css?family=Arbutus' rel='stylesheet' type='text/css'></head><body class='mat-typography'>"+
    "<style type='text/css'>"+

    "td{ text-align: center;}"+
    "th{ text-align: center;}"+
    "tr{ text-align: center;}"+
    ".factura {table-layout: fixed;}"+
    ".fact-info > div > h5 {font-weight: bold;}"+
    ".factura {table-layout: fixed;}.fact-info > div > h5 { font-weight: bold;}.factura > thead {border-top: solid 3px #000;border-bottom: 3px solid #000;}.factura > thead > tr > th:nth-child(2), .factura > tbod > tr > td:nth-child(2) {  width: 300px;}"+
    ".factura > thead > tr > th:nth-child(n+3) {  text-align: center;}.factura > tbody > tr > td:nth-child(n+3) {text-align: center;}.factura > tfoot > tr > th, .factura > tfoot > tr > th:nth-child(n+3) {  font-size: 24px;text-align: center;}.cond {border-top: solid 2px #000;} "+
    ".factura > thead {border-top: solid 3px #000;border-bottom: 3px solid #000;}.factura > thead > tr > th:nth-child(2), .factura > tbod > tr > td:nth-child(2) {width: 200px;} .factura > thead > tr > th:nth-child(n+3) {text-align: center;} .factura > tbody > tr > td:nth-child(n+3) {text-align: center;} .factura > tfoot > tr > th, .factura > tfoot > tr > th:nth-child(n+3) {font-size: 24px;text-align: center;} medio{text-align: center;color: #000;margin: 50px;} .cond {border-top: solid 2px #000;} * {font-family: 'Arbutus Slab', sans-serif;} h1 {   margin: 0 0 0px;} .mat-typography p {margin: 0 0 12px;}"+
    "</style>"+
    "<div id='app' class='col-11' style='margin: 1px; width: 100%;'>"+
    "<div class='row'>"+
    "<table class='table'><thead><tr><th><div style='margin-right: 80px'>"+
    "<h1  style='font-size: x-large;; font-family: "+'Bungee Inline'+", sans-serif;' class='medio'>'INVENTARIO'</h1>"+
    "<h1  style='font-size: smaller; ' class='medio'>Calle XXXXX zona Centro XXXXXXX <br> Cel: XXXXXXXX</h1>"+
    "</div></th>"+
    "<th style='vertical-align: middle'>"+
    "<h1  style='font-weight: bold; font-size: xx-large;font-family: "+'Bungee Inline'+", sans-serif;'>RECIBO DE CAJA</h1>"+
    "<h1  style='font-size: smaller; ' class='medio'>Nº 000"+venta.venta.id+"</h1>"+
    "</th>"+
    "</tr></thead></table></div><hr>"+
    "<div class='row'>"+
    "<div class='col-12'>"+
    "<P style='font-size: larger;'><strong>San Cristóbal ,</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "+ date.getDate()+
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;de &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ this.months[date.getMonth()+1]+" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;de"+
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+date.getFullYear()+".</P><p style='font-size: larger;'> <strong>Razon Social :</strong> <label style='text-transform: capitalize;'> "+ venta.venta.nombreCliente + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <strong>Nit :</strong>  "+ venta.venta.nit +" </label></p>"+
    
      "</div></div>"+
    "<div class='row my-5'><table style='width: 100%;' class='table table-borderless factura'><thead><tr><th style='width: fit-content;'>Codigo</th><th style='width: fit-content;'>Cant.</th><th colspan='2'>"+
    "Descripcion</th><th>Precio U.</th><th>Subtotal</th><th>Descuento</th><th>Total</th></tr></thead><tbody>"+
    "<tbody>"+
    lista+
    "</tbody>"+
    "<tfoot>"+
    "<tr>"+  
    "<th></th>"+
    "<th></th>"+
    "<th></th>"+
     "<th></th>"+
    "<th></th>"+
    "<th></th>"+
    "<th>Total</th>"+
    "<th>"+venta.venta.total+" Bs.</th></tr>"
    +"</div>"

    const WindowPrt = window.open();
    WindowPrt?.document.write(imprimir);


    setTimeout(() => {
      WindowPrt?.focus();
      WindowPrt?.print();
      WindowPrt?.close();
    }, 50);


  }
}
