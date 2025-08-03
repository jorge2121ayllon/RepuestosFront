import { Component } from '@angular/core';
import { CategoriaService } from './../../../Services/categoria/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from './../../../Services/venta/venta.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReporteVenta } from 'src/app/Models/venta/reporteVenta';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reporte-caja',
  templateUrl: './reporte-caja.component.html',
  styleUrls: ['./reporte-caja.component.css']
})
export class ReporteCajaComponent {
  objeto:any
  categoria = 0;
  ganaciaTotal = 0;
  cantidadTotal = 0;
  inversionTotal = 0;
  vendidoTotal = 0;
  descuento = 0;
  categorias! : any[];
  displayedColumns: string[] = ['Descripcion','Precio Venta','Cantidad Vendida', 'Venta' ];
  listaReporte : ReporteVenta[] = [];


  constructor(private route: ActivatedRoute,private VentaService: VentaService, private fb : FormBuilder,private CategoriaService : CategoriaService,
    private toastr: ToastrService)
  {
  }
}
