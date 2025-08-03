import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/Services/stock/stock.service';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  productos!:any;
  productosImprimibles!:any;
  disabled = new FormControl(false);//var para el tooltip
  //variables para el panel descripcion de los productos
  descripcionPanel="";
  marcaPanel="";
  codigoPanel="";
  codigoInternoPanel="";
  categoriaPanel="";
  stockPanel=0;
  fechaMovimientoPanel="";
  //
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  //
  token!:any;//var para el token
  constructor(private service: StockService, private PaginacionService: PaginacionService) {}
  ngOnInit(): void {
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1;// para el numero de la pagina
    //para verifica si hay token 
      this.cargarLista();
      this.cargarListaImprimible();
  }
  cargarLista(){
    this.service.lista(false).subscribe((resp:any) => {
      this.productos=resp.data;
      this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
      this.length=this.metadata.totalCount;
    })
  }
  cargarListaImprimible(){
    this.service.lista(true).subscribe((resp:any) => {
      this.productosImprimibles=resp;
    })
  }
  mostrar(obj:any){
    this.descripcionPanel=obj.descripcion;
    this.marcaPanel=obj.marca;
    this.codigoPanel=obj.codigo;
    this.codigoInternoPanel=obj.codigoInterno;
    this.categoriaPanel=obj.idCategoriaNavigation.nombre;
    this.stockPanel=obj.stock;
    this.fechaMovimientoPanel=obj.fechaMovimiento;
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
  printer() {
    const printContent = document.getElementById("print");
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt!.document.write(printContent!.innerHTML);
    WindowPrt!.document.close();
    WindowPrt!.focus();
    WindowPrt!.print();
    WindowPrt!.close();
  }
}
