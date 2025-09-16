import { CategoriaService } from './../../../Services/categoria/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from './../../../Services/venta/venta.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ReporteVenta } from 'src/app/Models/venta/reporteVenta';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reporteventa',
  templateUrl: './reporteventa.component.html',
  styleUrls: ['./reporteventa.component.css']
})
export class ReporteventaComponent {

  categoria = 0;
  ganaciaTotal = 0;
  cantidadTotal = 0;
  inversionTotal = 0;
  vendidoTotal = 0;
  descuento = 0;
  Error = 0;
  egresos = 0;

  categorias!: any[];

  // USO DE IDS (sin espacios) que coinciden con las propiedades del objeto
  displayedColumns: string[] = [
    'descripcion',
    'precioVenta',
    'precioCompra',
    'cantidadVendida',
    'totalInversion',
    'totalVendido',
    'descuento',
    'deuda',
    'totalGanancia'
  ];

  listaReporte: ReporteVenta[] = [];
  dataSource = new MatTableDataSource<ReporteVenta>([]);

  form: FormGroup;

  // ViewChild como SETTER: se ejecuta cuando el MatSort está listo (evita problemas con *ngIf)
  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    // asignar al dataSource cada vez que el sort esté disponible
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  constructor(
    private VentaService: VentaService,
    private fb: FormBuilder,
    private CategoriaService: CategoriaService,
    private toastr: ToastrService
  ) {
    this.cargarLista();
    this.form = this.fb.group({
      inicio: new FormControl('', Validators.required),
      fin: new FormControl('', Validators.required),
      IdCategoria: new FormControl(0)
    });
  }

  cargarLista() {
    this.CategoriaService.listaHijasIdPadre(1).subscribe((resp: any) => {
      this.categorias = resp.data;
    });
  }

  buscar() {
    if (this.form.valid) {
      this.ganaciaTotal = 0;
      this.cantidadTotal = 0;
      this.inversionTotal = 0;
      this.vendidoTotal = 0;
      this.descuento = 0;

      this.VentaService.ReporteVentas(
        this.form.value.inicio,
        this.form.value.fin,
        this.form.value.IdCategoria
      ).subscribe(r => {
        this.listaReporte = r as any;

        // en vez de crear una nueva instancia, puedes reasignar data y conservar referencias
        this.dataSource.data = this.listaReporte;

        // Asegúrate de asignar el sort si ya está inicializado
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        if (this.listaReporte.length > 0) {
          this.egresos = this.listaReporte[0].egresos?.valueOf() || 0;
          this.Error = 0;
          // recalcula totales
          this.listaReporte.forEach(element => {
            if (
              element.totalGanancia !== undefined &&
              element.cantidadVendida !== undefined &&
              element.totalInversion !== undefined &&
              element.totalVendido !== undefined
            ) {
              this.ganaciaTotal += element.totalGanancia || 0;
              this.cantidadTotal += element.cantidadVendida || 0;
              this.inversionTotal += element.totalInversion || 0;
              this.vendidoTotal += element.totalVendido || 0;
              if (element.descuento) this.descuento += element.descuento;
            }
          });
        } else {
          this.Error = -1;
        }
      });
    }
  }
imprimir() {
  const contenido = document.getElementById("contenido-imprimir")?.innerHTML;
  const ventana = window.open("", "_blank", "width=800,height=600");

  ventana?.document.write(`
    <html>
      <head>
        <title>Reporte</title>
        <!-- Fuente de Material Icons -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

        <style>
          body { font-family: Arial, sans-serif; }

          /* Forzar grid impresión */
          .row {
            display: flex !important;
            flex-wrap: wrap !important;
          }

          .col-xl-2, .col-md-6, .col {
            flex: 0 0 30% !important;   /* 3 cards por fila */
            max-width: 30% !important;
            padding: 4px !important;
            display: block !important;
          }

          .card {
            margin: 4px !important;
            padding: 6px !important;
            height: auto !important;
            box-shadow: none !important;
            border: 1px solid #ccc;
            border-radius: 6px;
          }

          .card-body {
            padding: 6px !important;
          }

          .card .h5 {
            font-size: 12px !important;
          }

          .text-xs {
            font-size: 11px !important;
          }

          mat-icon, .material-icons {
            font-size: 20px !important;
            vertical-align: middle;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 11px !important;
          }

          th, td {
            border: 1px solid #999;
            padding: 4px !important;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${contenido}
      </body>
    </html>
  `);

  ventana?.document.close();
  ventana?.print();
}




}


