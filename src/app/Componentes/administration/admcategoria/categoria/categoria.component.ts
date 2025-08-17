import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Categoria } from 'src/app/Models/Administration/categoria';
import { FormcategoriaComponent } from '../formcategoria/formcategoria.component';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginacionService } from 'src/app/Services/paginacion.service';
@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  
  categorias!:any[];//var para la lista de categorias
  categoriasTabla!:any[];//var para la lista de categorias para mostrar los nombres en la tabla de idCategoria
  token!:any;//var para el token
  displayedColumns: string[] = ['Id', 'Nombre', 'Descripcion', 'Acciones'];//columnas de la tabla
  dataSource!:any;//var para agregar datos a la tabla
  disabled = new FormControl(false);//var para el tooltip
  @ViewChild(MatPaginator)paginatorr!: MatPaginator ;//var para la paginacion
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 5;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex:number=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  respuesta!:any//vara para refrescar la lista luego de regresar del formulario
  constructor(public dialog: MatDialog,private service:CategoriaService,private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl) {}
  
  ngOnInit(): void {
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1;// para el numero de la pagina
    //para verifica si hay token 
    if(this.token!=null){
      this.cargarLista(this.token);
      this.cargarListaTabla(this.token);
    }
    this.cargarLista(this.token);
  }

//para validar por separado mas en especifico(no implementado)
   passwordMatchValidator(g: FormGroup) {
    return g.get('password')!.value === g.get('passwordRepeat')!.value
       ? null : {'mismatch': true};
 }

 //metodo para abrir el modal
 openDialog(tipo:number,obj:any) {
  if(tipo===1){
    const dialogRef =this.dialog.open(FormcategoriaComponent, {
      data: {id: 0, obj: null},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista(this.token);
    });
  }
  if(tipo===2){
    const dialogRef =this.dialog.open(FormcategoriaComponent, {
      data: {id: obj.id, obj: obj},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarLista(this.token);
    });
  }
 
}
//metodo para cargar la lista
cargarLista(token:string){
  this.service.lista(token).subscribe((resp:any) => {
    this.categorias=resp.data;
    this.dataSource = new MatTableDataSource<Categoria>(this.categorias); //cargando la lista en la tabla
    //this.dataSource.paginator = this.paginator; //paginator

    this.metadata = resp.meta;//para almacenar los datos de la paginacion que llegan
    this.length=this.metadata.totalCount;
  })
}
handlePage(e: PageEvent)
  {
   this.pageIndex=e.pageIndex;
   this.PaginacionService.Filtro.PageNumber=e.pageIndex+1;
   this.PaginacionService.Filtro.PageSize=e.pageSize;
   this.cargarLista(this.token);
  }
//metodo para filtrar datos en la tabla
  filtrar() {
    this.pageIndex=0;
    this.PaginacionService.Filtro.filter=this.filtro.value;
//observado-----------
    this.PaginacionService.Filtro.PageNumber=1;
    this.PaginacionService.Filtro.PageSize=5;
//observado-------------
    this.cargarLista(this.token);
  }

  //metodo para eliminar la categoria
  eliminar(id:number){
    if(confirm("Estas Seguro Eliminar la Categoria")){
      this.service.eliminar(id,this.token).subscribe((resp:any) => {
        console.log(resp);
        this.cargarLista(this.token);
      })
    }
  }

  mostrarNombreCategorias(id:number){
    for (let index = 0; index < this.categoriasTabla?.length; index++) {
      if(this.categoriasTabla[index].id==id){
        return this.categoriasTabla[index].nombre;
      }
    }
  }

//metodo para cargar la lista de categorias para mostrar los nombres de idCategoria
cargarListaTabla(token:string){
  this.service.listaSelect(token).subscribe((resp:any) => {
    this.categoriasTabla=resp.data;
  })
}
}
