import { CategoriaService } from './../../../Services/categoria/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from './../../../Services/venta/venta.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ReporteVenta } from 'src/app/Models/venta/reporteVenta';

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

  categorias! : any[];

  displayedColumns: string[] = ['Descripcion','Precio Venta','Precio Compra','Cantidad Vendida','Inversion', 'Venta','Descuento', 'Ganancia' ];


  listaReporte : ReporteVenta[] = [];
  form : FormGroup;

  constructor(private VentaService: VentaService, private fb : FormBuilder,private CategoriaService : CategoriaService,
    private toastr: ToastrService)
  {
    this.cargarLista();
    this.form = this.fb.group({
      inicio: new FormControl('',Validators.required),
      fin: new FormControl('',Validators.required),
      IdCategoria: new FormControl(0)
    })
  }



  cargarLista(){
    this.CategoriaService.listaHijasIdPadre(1).subscribe((resp:any) => {
      this.categorias=resp.data;
    })
  }


  buscar()
  {

    if(this.form.valid)
    {

      this.ganaciaTotal = 0;
      this.cantidadTotal = 0;
      this.inversionTotal = 0;
      this.vendidoTotal = 0;
      this.descuento = 0;
     


      this.VentaService.ReporteVentas( this.form.value.inicio,this.form.value.fin,this.form.value.IdCategoria).subscribe(
        r=>{
          this.listaReporte = r as any;

          console.log(this.listaReporte);
          if(this.listaReporte.length>0)
          {
            this.egresos = this.listaReporte[0].egresos?.valueOf() || 0;
            this.Error=0;
            this.listaReporte.forEach(element => {

              if(element.totalGanancia && element.cantidadVendida && element.totalInversion
                && element.totalVendido )
              {
                this.ganaciaTotal = this.ganaciaTotal + element.totalGanancia;
                this.cantidadTotal = this.cantidadTotal + element.cantidadVendida;
                this.inversionTotal = this.inversionTotal + element.totalInversion;
                this.vendidoTotal = this.vendidoTotal + element.totalVendido;
                if(element.descuento)
                this.descuento = this.descuento + element.descuento;
              }
            });
          }
          else{
            this.Error=-1;
          }


        }
      )

    }
  }




}
