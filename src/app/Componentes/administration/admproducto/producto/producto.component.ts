import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormproductoComponent } from '../formproducto/formproducto.component';
import { ProductoService } from 'src/app/Services/producto/producto.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { Producto } from 'src/app/Models/Administration/producto';
import { CodigobarraComponent } from '../codigobarra/codigobarra.component';
import { LoginService } from '../../../../Services/login/login.service';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos!:any[];//var para la lista de productos
  categoriasTabla!:any[];//var para la lista de categorias para mostrar los nombres en la tabla de idCategoria
  token!:any;//var para el token
  displayedColumns: string[] = ['Id', 'PrecioCompra', 'PrecioVenta', 'Marca', 'Descripcion', 'Stock', 'Codigo','FechaMovimiento','IdCategoria', 'Acciones'];//columnas de la tabla
  dataSource!:any;//var para agregar datos a la tabla
  disabled = new FormControl(false);//var para el tooltip
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  
  //<----------------------------------------------------->
  constructor(public _authService: LoginService,public dialog: MatDialog,private service:ProductoService,private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl) {}
  //<----------------------------------------------------->
  ngOnInit(): void {
    if (this._authService.IsCajero()) {
      this.displayedColumns=['Id', 'PrecioVenta', 'Marca', 'Descripcion', 'Stock', 'Codigo','IdCategoria'];
    }
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1;// para el numero de la pagina
    //para verifica si hay token 
    if(this.token!=null){
      this.cargarLista(this.token);
    }
    this.cargarLista(this.token);
  }
//<----------------------------------------------------->
  //metodo para abrir el modal ----- ↓
 openDialog(tipo:number,obj:any) {
  if(tipo===1){
    const dialogRef =this.dialog.open(FormproductoComponent, {
      data: {id: 0, obj: null},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista(this.token);
    });
  }
  if(tipo===2){
    const dialogRef =this.dialog.open(FormproductoComponent, {
      data: {id: obj.id, obj: obj},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista(this.token);
    });
  }
 }
 //<----------------------------------------------------->
//metodo para cargar la lista--- ↓
cargarLista(token:string){
  this.service.lista(token).subscribe((resp:any) => {
    this.productos=resp.data;
    this.dataSource = new MatTableDataSource<Producto>(this.productos); //cargando la lista en la tabla
    this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
    this.length=this.metadata.totalCount;
  })
}
//<----------------------------------------------------->
handlePage(e: PageEvent)
  {
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.cargarLista(this.token);
  }
  //<----------------------------------------------------->
//metodo para filtrar datos en la tabla ---- ↓
  filtrar() {
    this.pageIndex=0;
    this.PaginacionService.Filtro.filter=this.filtro.value;
//observado-----------
    this.PaginacionService.Filtro.PageNumber=1;
    this.PaginacionService.Filtro.PageSize=5;
//observado-------------
    this.cargarLista(this.token);
  }
//<----------------------------------------------------->
  //metodo para eliminar la categoria ---- ↓
  eliminar(id:number){
    if(confirm("Estas Seguro Eliminar el Producto")){
      this.service.eliminar(id,this.token).subscribe((resp:any) => {
        this.cargarLista(this.token);
      })
    }
  }

  openDialogCodigoBarra(obj:any) {
    const dialogRef =this.dialog.open(CodigobarraComponent, {
      data: {obj: obj},
    });
  }
}
