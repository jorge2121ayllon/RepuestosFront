import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Usuario } from 'src/app/Models/Administration/usuario';
import { PaginacionService } from 'src/app/Services/paginacion.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{
  usuarios!:any[]; 
  columnas:string[]=['nombreUsuario','correo','rol','acciones',];
  dataSource!:any;
  disabled = new FormControl(false);
  @ViewChild(MatPaginator)paginatorr!: MatPaginator ;
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  respuesta!:any//vara para refrescar la lista luego de regresar del formulario
  constructor(public dialog: MatDialog,private service:UsuarioService,private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl) 
  {
    this.paginator.itemsPerPageLabel = "Registros por página";
  }
  ngOnInit(): void {
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1
    this.cargarLista();
  }
  openDialog(tipo:number,obj:any) {
    if(tipo===1){
      const dialogRef =this.dialog.open(FormUsuarioComponent, {
        data: {id: 0, obj: null},
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarLista();
      });
    }
    if(tipo===2){
      const dialogRef =this.dialog.open(FormUsuarioComponent, {
        data: {id: obj.id, obj: obj},
        
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarLista();
      });
    }
  }
  eliminar(id:number){
    if(confirm("¿Estas Seguro Eliminar el usuario?")){
      this.service.delete(id).subscribe((resp:any) => {
        this.cargarLista();
      })
    }
  }
  cargarLista(){
    this.service.lista().subscribe((resp:any) => {
      this.usuarios=resp.data;
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      
      this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
      this.length=this.metadata.totalCount;
    })
  }
  filtrar() {
    this.PaginacionService.Filtro.filter=this.filtro.value;
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
