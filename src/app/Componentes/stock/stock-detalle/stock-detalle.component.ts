import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import { StockService } from 'src/app/Services/stock/stock.service'; 
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { Producto } from 'src/app/Models/Administration/producto';
import { MatDialog} from '@angular/material/dialog';
import { CodigobarraComponent } from '../../administration/admproducto/codigobarra/codigobarra.component';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
import { LoginService } from 'src/app/Services/login/login.service';
import { FormproductoComponent } from '../../administration/admproducto/formproducto/formproducto.component';
@Component({
  selector: 'app-stock-detalle',
  templateUrl: './stock-detalle.component.html',
  styleUrls: ['./stock-detalle.component.css']
})
export class StockDetalleComponent implements OnInit {

  displayedColumns: string[] = ['PrecioCompra', 'PrecioVenta', 'Marca','Motor','Tipo','Nombre', 'Descripcion', 'Stock','StockMinimo','Unidad', 'Codigo','FechaMovimiento','IdCategoria'];//columnas de la tabla
  dataSource!:any;//var para agregar datos a la tabla
   token!:any;//var para el token
  disabled = new FormControl(false);//var para el tooltip
  productos!:any[];//var para la lista de productos
  categorias!:any[];//var para la lista de categorias para el select
  categoriasPadre!:any[];//var para la lista de categorias padres para el select
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  producto!: FormGroup;
  //check
  checkPrecioCompra = new FormControl(false);
  checkPrecioVenta= new FormControl(false);
  checkMarca= new FormControl(false);
  checkMotor= new FormControl(false);//new
  checkTipo= new FormControl(false);//new
  checkNombre= new FormControl(false);//new
  checkDescripcion = new FormControl(false);
  checkStock = new FormControl(false);
  checkStockMinimo = new FormControl(false);
  checkCodigo = new FormControl(false);
  //checkFechaMovimiento = new FormControl(false);
  checkIdCategoria = new FormControl(0);
  checkCategoriaPadre = new FormControl(0);
  checkUnidad = new FormControl(false);
  //
  constructor(public _authService: LoginService,public dialog: MatDialog,private service:StockService,private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl, private serviceCategoria:CategoriaService) {}
  ngOnInit(): void {
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.FiltroStock.PrecioCompra=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.PrecioVenta=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Marca='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Motor='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Tipo='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Nombre='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Descripcion='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Stock=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.StockMinimo=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Codigo='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.IdCategoria=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.CategoriaPadre=0;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Unidad='';//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.FiltroStock.PageNumber=1;// para el numero de la pagina
    this.inicializarForm();
    this.cargarListaCategoriasPadres();
    //para verifica si hay token 
    if(this.token!=null){
      this.cargarLista();
    }
    this.cargarLista();
  }

cargarLista(){//metodo para cargar la lista--- ↓
  this.service.listaDetalle().subscribe((resp:any) => {
    this.productos=resp.data;
    this.dataSource = new MatTableDataSource<Producto>(this.productos); //cargando la lista en la tabla
    this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
    this.length=this.metadata.totalCount;
  })
}
 
 inicializarForm(){//metodo para inicializar el form --- ↓
  this.producto = new FormGroup({
    PrecioCompra: new FormControl(0),
    PrecioVenta: new FormControl(0),
    Marca: new FormControl(''),
    Motor: new FormControl(''),
    Tipo: new FormControl(''),
    Nombre: new FormControl(''),
    Descripcion: new FormControl(''),
    //FechaMovimiento: new FormControl(new Date),
    Stock: new FormControl(0),
    StockMinimo: new FormControl(0),
    Codigo: new FormControl(''),
    Unidad: new FormControl(''),
    IdCategoria: new FormControl(0),
    CategoriaPadre: new FormControl(0)
  });
}

handlePage(e: PageEvent)
  {
   this.PaginacionService.FiltroStock.PageNumber=e.pageIndex+1;
   this.PaginacionService.FiltroStock.PageSize=e.pageSize;
   this.cargarLista();
  }

  applyFilter() {
    
    this.Limpiador()
    console.log()
    this.PaginacionService.FiltroStock.PrecioCompra=this.producto.value.PrecioCompra;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.PrecioVenta=this.producto.value.PrecioVenta;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Marca=this.producto.value.Marca;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Motor=this.producto.value.Motor;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Tipo=this.producto.value.Tipo;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Nombre=this.producto.value.Nombre;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Descripcion=this.producto.value.Descripcion;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Stock=this.producto.value.Stock;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.StockMinimo=this.producto.value.StockMinimo;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Codigo=this.producto.value.Codigo;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.IdCategoria=this.producto.value.IdCategoria;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.CategoriaPadre=this.producto.value.CategoriaPadre;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.Unidad=this.producto.value.Unidad;//para mandar el filtro a la tabla
    this.PaginacionService.FiltroStock.PageNumber=1;
    this.PaginacionService.FiltroStock.PageSize=5;
    console.log(this.PaginacionService.FiltroStock.IdCategoria)
    this.cargarLista();
  }

  Limpiador()
{
  if(this.checkPrecioCompra.value==false)
  {
    this.producto.value.PrecioCompra=0;
  }
  if(this.checkPrecioVenta.value==false)
  {
    this.producto.value.PrecioVenta=0;
  }
  if(this.checkMarca.value==false)
  {
    this.producto.value.Marca='';
  }
  if(this.checkMotor.value==false)
  {
    this.producto.value.Motor='';
  }
  if(this.checkNombre.value==false)
  {
    this.producto.value.Nombre='';
  }
  if(this.checkTipo.value==false)
  {
    this.producto.value.Tipo='';
  }
  if(this.checkDescripcion.value==false)
  {
    this.producto.value.Descripcion='';
  }
  if(this.checkStock.value==false)
  {
    this.producto.value.Stock=0;
  }
  if(this.checkStockMinimo.value==false)
  {
    this.producto.value.StockMinimo=0;
  }
  if(this.checkCodigo.value==false)
  {
    this.producto.value.Codigo='';
  }
  if(this.checkCategoriaPadre.value==0)
  {
    this.producto.value.CategoriaPadre=0;
    this.producto.value.IdCategoria=0;
  }
  if(this.checkUnidad.value==false)
  {
    this.producto.value.Unidad='';
  }
}

openDialogCodigoBarra(obj:any) {
  const dialogRef =this.dialog.open(CodigobarraComponent, {
    data: {obj: obj},
  });
}
//metodo para cargar la lista de categorias hijas para el select
cargarListaCategorias(idPadre:number){
  this.serviceCategoria.listaHijasIdPadre(idPadre).subscribe((resp:any) => {
    this.categorias=resp.data;
  })
}
//metodo para cargar la lista de categorias padres para el select
cargarListaCategoriasPadres(){
  this.serviceCategoria.listaPadres(true).subscribe((resp:any) => {
    this.categoriasPadre=resp.data;
  })
}
//<----------------------------------------------------->
  //metodo para abrir el modal ----- ↓
 openDialog(tipo:number,obj:any) {
  if(tipo===1){
    const dialogRef =this.dialog.open(FormproductoComponent, {
      data: {id: 0, obj: null},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista();
    });
  }
  if(tipo===2){
    const dialogRef =this.dialog.open(FormproductoComponent, {
      data: {id: obj.id, obj: obj},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista();
    });
  }
 }

}
