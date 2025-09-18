import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormcategoriaComponent } from '../../administration/admcategoria/formcategoria/formcategoria.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/Services/categoria/categoria.service';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { Categoria } from 'src/app/Models/Administration/categoria';
import { ReciboService } from 'src/app/Services/recibo/recibo.service';
import { VentasComponent } from '../../venta/ventas/ventas.component';
import { FormreciboComponent } from '../formrecibo/formrecibo.component';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent {
recibos!:any[];//var para la lista de categorias
  categoriasTabla!:any[];//var para la lista de categorias para mostrar los nombres en la tabla de idCategoria
  token!:any;//var para el token
  displayedColumns: string[] = ['Id', 'Cliente', 'Descripcion','Fecha','Total', 'TipoPago', 'Acciones'];//columnas de la tabla
  dataSource!:any;//var para agregar datos a la tabla
  disabled = new FormControl(false);//var para el tooltip
  @ViewChild(MatPaginator)paginatorr!: MatPaginator ;//var para la paginacion
  metadata :any;//var para la paginacion
  length = 100;//var  para MatPaginator Inputs
  pageSize = 25;//var  para MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10,25, 100];//var  para MatPaginator Inputs
  pageIndex:number=0;//var  para MatPaginator Inputs
  filtro = new FormControl();//var para el campo de filtro
  respuesta!:any//vara para refrescar la lista luego de regresar del formulario
  numeroVenta=0;
 venta=<any>{};//vara para almacenar la venta que llega en el data  
  //
  cliente="";
  fecha=null;
  descripcion="";
  total=0;


  totalpagar = 0;
  totalpagado = 0;
  totalpendiente = 0;
  //
  constructor(public dialog: MatDialog,private service:ReciboService,private PaginacionService: PaginacionService, private paginator: MatPaginatorIntl
    ,@Inject(MAT_DIALOG_DATA) public data: any,public dialogg: MatDialog, public dialogRef: MatDialogRef<VentasComponent>
  ) {}
  
  ngOnInit(): void {
    
    console.log(this.data);
    this.token=localStorage.getItem('token');//para almacenar el token
    this.PaginacionService.Filtro.filter='';//para mandar el filtro a la tabla
    this.PaginacionService.Filtro.PageSize=5;// para el tamaño de la paginacion
    this.PaginacionService.Filtro.PageNumber=1;// para el numero de la pagina
    //para verifica si hay token 
    if(this.token!=null){
      this.cargarLista(this.token);
    }
    this.cargarLista(this.token);

    console.log(this.data.venta);
     this.venta = this.data.venta;
     this.totalpagar = this.venta.total;
      this.totalpagado = this.venta.qr + this.venta.efectivo;
      this.totalpendiente = this.totalpagar - this.totalpagado;
  }

 //metodo para abrir el modal
 openDialog(tipo:number,obj:any) {

  if(this.totalpendiente>0){
     if(tipo===1){
    const dialogRef =this.dialog.open(FormreciboComponent, {
      data: {id: 0, obj: this.data.venta.id},
    });
   dialogRef.afterClosed().subscribe((result: number) => {

    if(result>0){
      this.totalpagar =  this.totalpagar;
      this.totalpagado += Number(result);
      this.totalpendiente =  Number(this.totalpagar) -  Number(this.totalpagado);
      this.cargarLista(this.token);
    }
    
      
    });
  }
  if(tipo===2){
    const dialogRef =this.dialog.open(FormreciboComponent, {
      data: {id: obj.id, obj: obj},
    });
    dialogRef.afterClosed().subscribe(result => {;

      
         if(!result){
      this.totalpagar =  this.totalpagar;
      this.totalpagado += Number(result);
      this.totalpendiente =  Number(this.totalpagar) -  Number(this.totalpagado);
      this.cargarLista(this.token);
    }
    

    });
  }
  }
  else{
    alert("El total ya esta pagado");
  }

 
}
//metodo para cargar la lista aqui se manda el id de la venta que llega en el data
cargarLista(token:string){
  this.service.lista(token, this.data.venta.id).subscribe((resp:any) => {

    this.numeroVenta=this.data.venta.id;
   
    

    this.recibos=resp.data;
     console.log("estopooooooo");
    console.log(this.recibos);
    this.dataSource = new MatTableDataSource<Categoria>(this.recibos); //cargando la lista en la tabla
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
    if(confirm("Estas Seguro Eliminar el recibo")){
      this.service.eliminar(id,this.token).subscribe((resp:any) => {
        console.log(resp);
        this.cargarLista(this.token);
      })
    }
  }

 imprimir() {
    const printContent = document.getElementById("tabla");
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt!.document.write(printContent!.innerHTML);
    WindowPrt!.document.close();
    WindowPrt!.focus();
    WindowPrt!.print();
    WindowPrt!.close();
  }

  imprimirRecib(obj:any) {
    console.log(obj);
    this.cliente=obj.cliente;
    this.fecha=obj.date;
    this.descripcion=obj.descripcion;
    this.total=obj.total;
    const printContent = document.getElementById("recib");
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt!.document.write(printContent!.innerHTML);
    WindowPrt!.document.close();
     setTimeout(() => {
          WindowPrt?.focus();
          WindowPrt?.print();
          WindowPrt?.close();
        }, 50);
  }

}
