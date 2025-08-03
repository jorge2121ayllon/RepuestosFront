
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StockListComponent } from './Componentes/stock/stock-list/stock-list.component';
import { StockService } from './Services/stock/stock.service';
import { PaginacionService } from './Services/paginacion.service'
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginService } from './Services/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  title = 'libreriaFrontEdn';

  total=0;//var para mostrar el total de productos con poco stock
  productos!:any;//var para almacenar
  totalFecha=0;//var para mostrar el total de productos sin movimiento
  totalProductos=0;
  productosFecha!:any;//var para almacenar
  token!:any;//var para el token
  constructor(private router: Router,public _authService: LoginService,public dialog: MatDialog, private service: StockService, private PaginacionService: PaginacionService){}
  ngOnInit(): void {
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1;// para el numero de la pagina
    this.cargarListaSinMovimiento();
    this.cargarLista();
  }

  //metodo para abrir el modal el stock
 openDialog() {
  const dialogRef =this.dialog.open(StockListComponent);
  dialogRef.afterClosed().subscribe(result => {
    this.cargarLista();
  });
}
//carga la lista de productos con poco stock
cargarLista(){
  this.service.lista(false).subscribe((resp:any) => {
    this.productos=resp.data;
    this.total=resp.meta.totalCount;
    this.totalProductos+=this.total;
  })
}
//carga la lista de productos sin movmiento
cargarListaSinMovimiento(){
  this.service.listaDate(90).subscribe((resp:any) => {
    this.productosFecha=resp.data;
    this.totalFecha=resp.meta.totalCount;
    this.totalProductos+=this.totalFecha;
  })
}
  salir()
  {
    this._authService.loggedOut()
    this.router.navigate(['login']);
  }
}
