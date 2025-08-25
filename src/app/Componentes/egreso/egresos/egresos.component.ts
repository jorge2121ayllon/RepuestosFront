import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';import { Egreso } from 'src/app/Models/Administration/egreso';
import { AddegresoComponent } from '../addegreso/addegreso.component';
import { EgresoService } from 'src/app/Services/egreso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginacionService } from 'src/app/Services/paginacion.service';
@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent  implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'costo', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<Egreso>([]);
  token = localStorage.getItem("token") || "";

  @ViewChild(MatPaginator)paginatorr!: MatPaginator ;
  metadata :any;//var para la paginacion
    length = 100;//var  para MatPaginator Inputs
    pageSize = 5;//var  para MatPaginator Inputs
    pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
    pageIndex=0;//var  para MatPaginator Inputs
    filtro = new FormControl();//var para el campo de filtro
    respuesta!:any//vara para refrescar la lista luego de regresar del formulario


  constructor(
    private egresoService: EgresoService,
    private dialog: MatDialog,
     private paginator: MatPaginatorIntl,
     private PaginacionService: PaginacionService
 
  ) {this.paginator.itemsPerPageLabel = "Registros por página";}

  ngOnInit(): void {
      this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1
    this.cargarEgresos();
  }

  cargarEgresos() {
    this.egresoService.lista(this.token).subscribe((res: any) => {
      this.dataSource.data = res.data || res; // depende cómo te devuelva la API
     
      this.metadata = res.meta;//para almacenar los datos de la paginacion que llegan
      this.length=this.metadata.totalCount;

    });
  }

  abrirModal(egreso?: Egreso) {
    const dialogRef = this.dialog.open(AddegresoComponent, {
      width: '400px',
      data: egreso ? { ...egreso } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEgresos();
       
      }
    });
  }


    handlePage(e: PageEvent)
    {
     this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
     this.PaginacionService.Filtro.PageSize=e.pageSize;
     this.cargarEgresos();
    }


  eliminar(id: number) {
    if (confirm("¿Seguro que deseas eliminar este egreso?")) {
      this.egresoService.eliminar(id, this.token).subscribe(() => {
        this.cargarEgresos();
       
      });
    }
  }



  
}
