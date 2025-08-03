import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { VentaService } from 'src/app/Services/venta/venta.service';
import { Reporte } from 'src/app/Models/venta/reporte';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent {


  listaReporte : Reporte = new Reporte();



  constructor(private VentaService: VentaService){

    this.lista()
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   // this.lista()
   this.lista()
  }

  lista()
  {
    this.VentaService.Reporte( "mensual").subscribe(
      r=>{
        this.listaReporte = r as any ;
        this.randomize();
        })

  }


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // events


  public randomize(): void {
    // Only Change 3 values

    //para grafico 1
    this.barChartData.datasets[0].data = this.listaReporte.inversion;
    this.barChartData.datasets[1].data = this.listaReporte.venta;
    this.barChartData.datasets[2].data = this.listaReporte.ganancias;
    this.barChartData.labels = this.listaReporte.etiquetas;

    //grafico 2
    console.log("entro")
    this.pieChartData.labels = this.listaReporte.categorias;
    this.pieChartData.datasets[0].data = this.listaReporte.cantidadCategorias;

    this.chart?.update();
  }



  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: { display: true },
    }
  };

  public barChartLabels: string[] = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ];
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [ ], label: 'Gastos (Bs)' },
      { data: [ ], label: 'Ventas (Bs)' },
      { data: [ ], label: 'Ganancias (Bs)' },
    ]
  };


  public randomize2(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }




  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {

    labels: this.listaReporte.categorias,
    datasets: [ {
      data: [3002, 5002, 1000 ]
    } ]
  };

  public pieChartType: ChartType = 'pie';






  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {

  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {

  }


}
