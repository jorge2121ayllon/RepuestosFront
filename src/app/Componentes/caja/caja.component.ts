import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormCajaComponent } from '../caja/form-caja/form-caja.component';
import { CajaService } from 'src/app/Services/caja/caja.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Caja } from 'src/app/Models/caja';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { LoginService } from 'src/app/Services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { VentaService } from 'src/app/Services/venta/venta.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit{
  cajas!:any[];
  valorCaja :boolean=false
  valor:any
  objeto:any
  columnas:string[]=['apertura','cierre','fechaApertura','fechaCierre','usuario','Acciones'];
  dataSource!:any;
  disabled = new FormControl(false);
  @ViewChild(MatPaginator)paginatorr!: MatPaginator ;
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  respuesta!:any//vara para refrescar la lista luego de regresar del formulario
  form : FormGroup;
  constructor(private datePipe: DatePipe,private fb : FormBuilder,private router: Router,private toastr: ToastrService,private VentaService: VentaService,
    public dialog: MatDialog,public service:CajaService,private PaginacionService: PaginacionService,
    private paginator: MatPaginatorIntl, public authService: LoginService) {
      this.paginator.itemsPerPageLabel = "Registros por página";
      this.form = this.fb.group({
        inicio: new FormControl(null),
        fin: new FormControl(null),
        filtro: new FormControl(null)
      })
    }
  ngOnInit(): void {

    if(localStorage.getItem('cajaAbierta')=='abierta')
    {
      this.valorCaja=true
    }
    else{
      this.valorCaja=false
    }
    this.cargarLista();
    this.valor= localStorage.getItem('CantidadCajaApertura')
    if (this.authService.IsCajero() && this.valorCaja) {
      this.columnas=['apertura','cantidadActual','fechaApertura','fechaCierre','cerrarCaja','ImprimirCaja'];
    }
    if (this.authService.IsCajero() && !this.valorCaja) {
      this.columnas=['apertura','cantidadActual','fechaApertura','fechaCierre','ImprimirCaja'];
    }
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1

  }
  openDialog(tipo:number,obj:any) {
    if(tipo===1){
      const dialogRef =this.dialog.open(FormCajaComponent, {
        data: {id: 0, obj: null},
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarLista();
      });
    }
    if(tipo===2){
      const dialogRef =this.dialog.open(FormCajaComponent, {
        data: {id: obj.id, obj: obj},

      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarLista();
      });
    }

  }
  imprimir(obj:any){
    this.VentaService.ReporteCaja( obj);
  }
  cerrar(obj:Caja){


    this.service.close(obj).subscribe((resp:any) => {
      this.toastr.success("Caja cerrada.")
      localStorage.setItem('cajaAbierta','cerrada');
      localStorage.setItem('CantidadCajaActual','0')
      this.objeto=resp;
      //const objetoSerializado = encodeURIComponent(JSON.stringify(this.objeto));
      this.imprimir( this.objeto);
      this.cargarLista();
      //this.router.navigate(['/reporteCaja'], { queryParams: { objeto: objetoSerializado } });
    })
  }
  eliminar(id:any){
    if(confirm("¿Estas Seguro Eliminar el registro de la caja?")){
      if(id===localStorage.getItem("idCaja")){
        localStorage.setItem('cajaAbierta','cerrada')
        localStorage.setItem('CantidadCajaActual','0')
      }
      this.service.delete(id).subscribe((resp:any) => {
        this.cargarLista();
      })
    }
  }
  cargarLista(){
    this.service.lista().subscribe((resp:any) => {
      this.cajas=resp.data;
      this.dataSource = new MatTableDataSource<Caja>(this.cajas);
      this.metadata = resp.meta;
      this.length=this.metadata.totalCount;
    })
  }
  filtrar() {
    this.service.inicio= this.datePipe.transform(this.form.value.inicio, 'yyyy-MM-dd');
    this.service.fin= this.datePipe.transform(this.form.value.fin, 'yyyy-MM-dd');
    this.PaginacionService.Filtro.filter=this.form.value.filtro;
    this.PaginacionService.Filtro.PageNumber=1;
    this.PaginacionService.Filtro.PageSize=1000000;
    this.cargarLista();
  }
  handlePage(e: PageEvent)
  {
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.cargarLista();
  }
}
