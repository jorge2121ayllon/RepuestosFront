import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from 'src/app/Models/Administration/producto';

@Component({
  selector: 'app-codigobarra',
  templateUrl: './codigobarra.component.html',
  styleUrls: ['./codigobarra.component.css']
})
export class CodigobarraComponent implements OnInit {
  barCode="";
  descripcion="";
  marca="";
  fecha="";
  codigoInt="";
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<Producto>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    this.llenarDatos(this.data);
    console.log(this.data)
  }

  llenarDatos(obj:any){
   this.barCode=obj.obj.codigo;
   this.codigoInt=obj.obj.codigoInterno;
   this.descripcion=obj.obj.descripcion;
   this.marca=obj.obj.marca;
   this.fecha=obj.obj.fechaMovimiento;
  }

  printer() {
    const printContent = document.getElementById("print");
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt!.document.write(printContent!.innerHTML);
    WindowPrt!.document.close();
    WindowPrt!.focus();
    WindowPrt!.print();
    WindowPrt!.close();
  }

  //onclick="window.print()"
}
