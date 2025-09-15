import { VentasComponent } from './../ventas/ventas.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from './../../../Models/Administration/producto';

import { CajaService } from './../../../Services/caja/caja.service';
import { Caja } from 'src/app/Models/caja';

import { VentaService } from './../../../Services/venta/venta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaVentaDetalle } from './../../../Models/venta/ventaVentaDetalle';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { DetalleVenta } from 'src/app/Models/venta/detalleVenta';
import { PaginacionService } from 'src/app/Services/paginacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addventa',
  templateUrl: './addventa.component.html',
  styleUrls: ['./addventa.component.css']
})
export class AddventaComponent {
  cajaa=new Caja
  valorr!:any
  idventa = 0;
  //objeto de lista de detalles
  listadetalles : DetalleVenta[] = [];
  productosAux : Producto[] = [];
  desc= 0;
  totalEdit = 0;


  //buscador de producto
  producto = new FormControl();
  cantidad = new FormControl(0);
  listaProducto: Producto[] = [];
  productoSeleccionado! : Producto ;
  reinicioProducto! : Producto ;

  form: FormGroup;
  listadetalleVenta:DetalleVenta[]=[];

  venta: VentaVentaDetalle = new VentaVentaDetalle;
  totalVenta=0;

  constructor(private cajaService: CajaService, private toastr: ToastrService,private fb : FormBuilder,private Router: Router,private Route : ActivatedRoute,
    private VentaService: VentaService,private PaginacionService: PaginacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog, public dialogRef: MatDialogRef<AddventaComponent>)
    {


      this.idventa = data.id;
        //para el crear
      if(this.idventa==0){
        this.form = this.fb.group({

          //esto para el detalle de venta
          buscadorProducto: new FormControl(''),
          cantidad : new FormControl(1),

          //para la venta
          nombreCliente: new FormControl('',Validators.required),
          total : new FormControl(0),
          descuento : new FormControl(0),
          celular: new FormControl(''),
              nit: new FormControl(''),
               qr: new FormControl(0),
                efectivo: new FormControl(0),
                 servicio: [false],   // checkbox
                 credito: [false], 

  precio: [0],         // decimal
    descuentoPrecio : new FormControl(0),
        })
        //para el editar
      }else{
        this.form = this.fb.group({

          //esto para el detalle de venta
          buscadorProducto: new FormControl(''),
          cantidad : new FormControl(1),
          servicio: [false], 
           credito: [false], 
          //para la venta
          nombreCliente: new FormControl('',Validators.required),
          total : new FormControl(0),
          descuento : new FormControl(0),
        
          id: new FormControl(this.idventa),
          celular: new FormControl(''),
            nit: new FormControl(''),
            qr: new FormControl(0),
                efectivo: new FormControl(0),
         precio: [0],         // decimal
        descuentoPrecio : new FormControl(0),
        })
      }

    }


    ngOnInit(): void {
      if(this.idventa>0)
      {
        this.ObtenerVenta();
      }
    }


    //editar
    ObtenerVenta(){
      this.VentaService.getVenta(this.idventa).subscribe(
        r=>{
       
          this.form.controls['celular'].setValue(r.data.venta.celular)
          this.form.controls['descuento'].setValue(r.data.venta.descuento)
          this.form.controls['nombreCliente'].setValue(r.data.venta.nombreCliente)
          this.form.controls['total'].setValue(r.data.venta.total)
           this.form.controls['nit'].setValue(r.data.venta.nit)
           this.form.controls['qr'].setValue(r.data.venta.qr)
           this.form.controls['efectivo'].setValue(r.data.venta.efectivo)
            this.form.controls['servicio'].setValue(r.data.venta.servicio)
            this.form.controls['credito'].setValue(r.data.venta.credito)

            
          this.totalVenta = r.data.venta.total;
          this.listadetalles = r.data.detalleVenta;

          //sirve para el subtotal del producto
          this.listadetalles.forEach(element => {
              if(element.cantidad && element.subTotal)
              {

                element.precioVenta = element.subTotal / element.cantidad;
              }

          });
        }
      )
    }

    agregarDetalle()
    {


      let cantidadUnica = this.listadetalles.filter(x=>x.idProducto==this.productoSeleccionado.id).length;


      if( cantidadUnica<1 )

      {
        if(this.cantidad.value!=null && this.cantidad.value > 0 )
        {

            if(this.cantidad.value!=null && this.cantidad.value<this.productoSeleccionado.stock+1){


              this.productosAux.push(this.productoSeleccionado)

                  //creamos el objeto detalle
              let detalle = new DetalleVenta;
              detalle.producto = this.productoSeleccionado.descripcion +" "+ this.productoSeleccionado.marca;
              detalle.precioVenta = this.productoSeleccionado.precioVenta;
              detalle.cantidad = this.cantidad.value;
              detalle.idProducto = this.productoSeleccionado.id;
              detalle.subTotal = (this.productoSeleccionado.precioVenta * this.cantidad.value) - this.form.value.descuento;
              detalle.preciocompra = this.productoSeleccionado.precioCompra;
              detalle.descuento = this.form.value.descuento

                  //agregamos a una lista de detalles agregando al carrito
              this.listadetalles.push(detalle);


                  //vamos guardando el total
            this.totalVenta= this.totalVenta + (this.productoSeleccionado.precioVenta * this.cantidad.value) - this.form.value.descuento ;
            this.productoSeleccionado = this.reinicioProducto;

            this.form.controls['descuento'].setValue(0);
            this.cantidad.setValue(0);
            }
            else{
              this.toastr.error('Ingrese una cantidad menor al stok disponible que se muestra en la pantalla !');
            }
        }
        else{
          this.toastr.error('Ing  rese una cantidad mayor a 0 para agregar al carrito !');
        }

      } else{
        this.toastr.error('No se puede agregar un mismo producto en el carrito !');
      }



      if ( this.form.value.servicio === true) {
        // Si es un servicio, deshabilitar el campo de descuento
        this.totalVenta = this.form.value.precio - this.form.value.descuentoPrecio;
        
      }
    }

    BuscarProducto()
    {
      this.VentaService.ListaProducto(this.producto.value).subscribe(r => {
            this.listaProducto = r.data;
            if(this.listaProducto.length==0)
            {
              this.toastr.error('No se encontro ningun producto con ese nombre');
            }
            if(this.listaProducto.length>1)
            {
              this.toastr.warning('Se encontraron varios productos con ese nombre, seleccione uno de la lista');
            }
           
      })
    }

    //para seleccionar un producto de la lista encontrada
    seleccionProducto(producto : Producto){
      this.productoSeleccionado = this.listaProducto.filter(x=>x.id == producto.id)[0];
      this.listaProducto = [];
      this.producto.setValue("");
    }


    eliminarDetalle(detalle: DetalleVenta)
    {

        if(detalle.subTotal!)
        {
          this.totalVenta=this.totalVenta-detalle.subTotal;
          this.listadetalles=this.listadetalles.filter((item) => item.idProducto != detalle.idProducto);

          if(this.idventa>0 && detalle.id)
          {
            this.VentaService.deleteDetalle(detalle.id).subscribe((resp:any) => {
              this.toastr.success("producto Eliminada.")
          }
          )
        }

        }


    }


    descuento()
    {


      if(this.totalVenta<this.form.value.descuento)
      {

        //this.toastr.warning('No se aplico el descuento');
        this.form.controls['descuento'].setValue(0);
      }

      this.desc = this.form.value.descuento;



    }

    guardar ()
    {
    
        if(this.idventa==0){
          if (this.form.valid && this.totalVenta>0)
          {
            
            this.totalVenta = this.totalVenta - this.form.value.descuento;
            this.form.value.total = this.totalVenta;


            this.venta.detalleVenta=this.listadetalles;
            this.venta.venta=this.form.value;


            if (!this.venta.venta.credito && (this.venta.venta.qr + this.venta.venta.efectivo) != this.venta.venta.total) {
              this.toastr.error('Los pagos son menores al total!');
            } 
            else{ 
              this.VentaService.add(this.venta).subscribe(r => {
              this.toastr.success('Venta exitosa');
              this.venta.venta.id = r.data.id;
              this.dialogRef.close();
              this.VentaService.imprimirFormato(this.venta);
            })
             }
            
          }
          else{
            this.toastr.error('Porfavor complete la venta !');
          }
        }
      
     


      if(this.idventa>0){
        if (this.form.valid && this.totalVenta>0)
        {
          //this.totalVenta = this.totalVenta + this.form.value.descuento;
          if(this.form.value.descuento>0) {
          this.form.value.total = this.totalVenta -  this.form.value.descuento;
          } else {
            this.form.value.total = this.totalVenta;
          }
         
     
          this.venta.detalleVenta=this.listadetalles;
          this.venta.venta=this.form.value;

if (!this.venta.venta.credito && (this.venta.venta.qr + this.venta.venta.efectivo) != this.venta.venta.total) {
  this.toastr.error('Los pagos son menores al total!');
} else {
  this.VentaService.update(this.venta).subscribe(r => {
    this.toastr.success('Editó exitosamente la venta');
    this.dialogRef.close();
    this.VentaService.imprimirFormato(this.venta);
  });
}

     
        
        }
        else{
          this.toastr.error('Porfavor complete la venta !');
        }
      }

    }


    editarDetalle(detalleSeleccionado : DetalleVenta)
    {
      this.eliminarDetalle(detalleSeleccionado);
      this.productoSeleccionado= (this.productosAux.filter(listaProductosAux=>listaProductosAux.id==detalleSeleccionado.idProducto))[0];

    }


}
