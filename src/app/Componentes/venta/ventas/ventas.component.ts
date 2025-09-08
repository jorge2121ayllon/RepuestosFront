import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddventaComponent } from './../addventa/addventa.component';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from './../../../Services/venta/venta.service';
import { Component } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { CajaService } from 'src/app/Services/caja/caja.service';
import { ReciboComponent } from '../../recibos/recibo/recibo.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {



  displayedColumns: string[] = ['id','nombreCliente','nit','celular','fecha','recibo', 'total','qr', 'efectivo','acciones'];
  metadata :any;
  ventas : any ;

  filtro = new FormControl();


  // MatPaginator Inputs
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10,25, 100];
  pageIndex=0;

  constructor(private toastr: ToastrService,public dialog: MatDialog,private VentaService : VentaService,private Router: Router, private cajaService: CajaService,
    private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl,
    ) {
      this.paginator.itemsPerPageLabel = "Registros por página";
      if (localStorage.getItem("role")=="cajero") {
        this.displayedColumns= ['id','nombreCliente','nit','celular','fecha', 'total', 'qr', 'efectivo'];
      }
    }


    ngOnInit(): void {
      this.PaginacionService.Filtro.filter='';
      this.PaginacionService.Filtro.PageSize=5;
      this.PaginacionService.Filtro.PageNumber=1;
      this.Ventas();
    }


    Ventas()
  {


    this.VentaService.Lista().subscribe( r =>
      {
        this.ventas = r.data;
        console.log(this.ventas)
        this.metadata = r.meta;
        this.length=this.metadata.totalCount;
      })

  }

  handlePage(e: PageEvent)
  {
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.Ventas();
  }

  Filtro() {
    this.PaginacionService.Filtro.filter=this.filtro.value;
    this.Ventas();
  }


  borrar(id:number){
    if(confirm("Estas Seguro Eliminar la Categoria")){
      this.VentaService.delete(id).subscribe((resp:any) => {
        this.toastr.success("Venta Eliminada.")
        this.Ventas();
      })
    }
  }

  openDialog(opcion : number) {

    this.cajaService.getCajaAbierta().subscribe((resp:any) => {
      let respuesta = resp;
      if( respuesta == true ){
        const dialogRef =this.dialog.open(AddventaComponent, {
          data: {id: opcion , idalquiler : 0 },
          width: '90%',
          height: '90%',
        });
        dialogRef.afterClosed().subscribe(result => {
          this.Ventas();
    
    
        });
      }
      
    
      else{
        this.toastr.error("Debe abrir caja antes de realizar una venta")
      }


      })



   
    }

    openRecibos(obj:any){
      const dialogRef =this.dialog.open(ReciboComponent, {
          data: { venta : obj },
          width: '90%',
          height: '90%',
        });
        dialogRef.afterClosed().subscribe(result => {
          this.Ventas();
        });
    }

}
