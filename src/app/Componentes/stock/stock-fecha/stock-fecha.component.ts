import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/Services/stock/stock.service';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-stock-fecha',
  templateUrl: './stock-fecha.component.html',
  styleUrls: ['./stock-fecha.component.css']
})

export class StockFechaComponent implements OnInit{
  productos!:any;
  dias=new FormControl(90);;
  fechaActual= new FormControl(new Date());
  fechaMovimiento= new FormControl(new Date());
  //para mostrar en el grid datos generales
  descripcionPanel="";
  marcaPanel="";
  codigoPanel="";
  codigoInternoPanel="";
  categoriaPanel="";
  stockPanel=0;
  stockMinimoPanel=0;
  precioCompraPanel=0;
  precioVentaPanel=0;
  //
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  //
  constructor(private service: StockService, private PaginacionService: PaginacionService) {}
  ngOnInit(): void {
    this.cargarLista();
  }
  selected!: Date | null;

  cargarLista(){
    this.service.listaDate(this.dias.value!).subscribe((resp:any) => {
      this.productos=resp.data;
      this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
      this.length=this.metadata.totalCount;
    })
  }
  //<----------------------------------------------------->
  handlePage(e: PageEvent)
  {
   this.pageIndex=e.pageIndex;
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.cargarLista();
  }
//metodo para filtrar datos en la tabla
  filtrar() {
    this.pageIndex=0;
    this.PaginacionService.Filtro.filter=this.filtro.value;
//observado-----------
    this.PaginacionService.Filtro.PageNumber=1;
    this.PaginacionService.Filtro.PageSize=5;
//observado-------------
    this.cargarLista();
  }
  mostrar(obj:any){
    //para mostrar la fecha en el datepicker
    const [dateComponents, timeComponents] = obj.fechaMovimiento.split('T');
    const [year,month, day] = dateComponents.split('-');
    const date = new Date(+year, +month - 1, +day);
    console.log(date);
    this.fechaMovimiento.setValue(date);
    //
    //para mostrar los datos en el grid de datos generales
    this.descripcionPanel=obj.descripcion;
    this.marcaPanel=obj.marca;
    this.codigoPanel=obj.codigo;
    this.codigoInternoPanel=obj.codigoInterno;
    this.categoriaPanel=obj.idCategoriaNavigation.nombre;
    this.stockPanel=obj.stock;
    this.stockMinimoPanel=obj.stockMinimo;
    this.precioCompraPanel=obj.precioCompra;
    this.precioVentaPanel=obj.precioVenta
  }

  cambiarDias(){
    this.cargarLista();
  }
}
