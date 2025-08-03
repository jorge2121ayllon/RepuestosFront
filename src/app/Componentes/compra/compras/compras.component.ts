import { AddcompraComponent } from './../addcompra/addcompra.component';
import { PaginacionService } from './../../../Services/paginacion.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CompraService } from './../../../Services/compra/compra.service';
import { VentaService } from './../../../Services/venta/venta.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {



  displayedColumns: string[] = ['id','total','acciones'];
  metadata :any;
  compras : any ;

  filtro = new FormControl();


  // MatPaginator Inputs
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10,25, 100];
  pageIndex=0;


  constructor(private toastr: ToastrService,public dialog: MatDialog,
    private CompraService : CompraService,private Router: Router,
    private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl,
    ) {
      this.paginator.itemsPerPageLabel = "Registros por página";
    }


    ngOnInit(): void {
      this.PaginacionService.Filtro.filter='';
      this.PaginacionService.Filtro.PageSize=5;
      this.PaginacionService.Filtro.PageNumber=1;
      this.Compras();
    }

    Compras (){


      this.CompraService.Lista().subscribe( r =>
        {
          console.log(r.data)
          this.compras = r.data;
          this.metadata = r.meta;
          this.length=this.metadata.totalCount;
        })

    }



  handlePage(e: PageEvent)
  {
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.Compras();
  }

  Filtro() {
    this.PaginacionService.Filtro.filter=this.filtro.value;
    this.Compras();
  }

  borrar(id:number){
    if(confirm("Estas Seguro Eliminar la Categoria")){
      this.CompraService.delete(id).subscribe((resp:any) => {
        this.toastr.success("Venta Eliminada.")
        this.Compras();
      })
    }
  }

  openDialog(opcion : number) {

    const dialogRef =this.dialog.open(AddcompraComponent, {
      data: {id: opcion},
      width: '70%',
      height: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.Compras();


    });
  }







}
