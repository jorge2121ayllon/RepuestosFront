import { CompraService } from './../../../Services/compra/compra.service';
import { PaginacionService } from './../../../Services/paginacion.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompraCompraDetalle } from './../../../Models/compra/CompraCompraDetalle';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Producto } from './../../../Models/Administration/producto';
import { DetalleCompra } from './../../../Models/compra/detalleCompra';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-addcompra',
  templateUrl: './addcompra.component.html',
  styleUrls: ['./addcompra.component.css']
})
export class AddcompraComponent {
  idcompra = 0;
  //objeto de lista de detalles
  listadetalles : DetalleCompra[] = [];
  productosAux : Producto[] = [];


  //buscador de producto
  producto = new FormControl();
  cantidad = new FormControl(0);
  listaProducto: Producto[] = [];
  productoSeleccionado! : Producto ;
  reinicioProducto! : Producto ;

  form: FormGroup;
  listadetalleCompra:DetalleCompra[]=[];

  compra: CompraCompraDetalle = new CompraCompraDetalle;
  totalCompra=0;


  constructor(private toastr: ToastrService,private fb : FormBuilder,private Router: Router,private Route : ActivatedRoute,
    private CompraService: CompraService,private PaginacionService: PaginacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog, public dialogRef: MatDialogRef<AddcompraComponent>)
    {


      this.idcompra = data.id;
        //para el crear
      if(this.idcompra==0){
        this.form = this.fb.group({

          //esto para el detalle de venta
          buscadorProducto: new FormControl(''),
          cantidad : new FormControl(1),

          //para la venta
          total : new FormControl(0),

        })
        //para el editar
      }else{
        this.form = this.fb.group({

          //esto para el detalle de venta
          buscadorProducto: new FormControl(''),
          cantidad : new FormControl(1),
          id: new FormControl(this.idcompra),
          //para la venta
          total : new FormControl(0),

        })
      }

    }

    ngOnInit(): void {
      if(this.idcompra>0)
      {
        this.ObtenerVenta();
      }
    }



    //editar
    ObtenerVenta(){
      this.CompraService.getcompra(this.idcompra).subscribe(
        r=>{
          console.log(r)

          this.form.controls['total'].setValue(r.data.compra.total)
          this.totalCompra = r.data.compra.total;
          this.listadetalles = r.data.detalleCompra;

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

            if(this.cantidad.value!=null ){


              this.productosAux.push(this.productoSeleccionado)

                  //creamos el objeto detalle
              let detalle = new DetalleCompra;
              detalle.producto = this.productoSeleccionado.descripcion + this.productoSeleccionado.marca;
              detalle.precioVenta = this.productoSeleccionado.precioCompra;
              detalle.cantidad = this.cantidad.value;
              detalle.idProducto = this.productoSeleccionado.id;
              detalle.subTotal = this.productoSeleccionado.precioCompra * this.cantidad.value;

                  //agregamos a una lista de detalles agregando al carrito
              this.listadetalles.push(detalle);


                  //vamos guardando el total
            this.totalCompra= this.totalCompra +this.productoSeleccionado.precioCompra*this.cantidad.value;
            this.productoSeleccionado = this.reinicioProducto;

            }
            else{
              this.toastr.error('Ingrese una cantidad de productos !');
            }
        }
        else{
          this.toastr.error('Ingrese una cantidad mayor a 0 para agregar al carrito !');
        }
      } else{
        this.toastr.error('No se puede agregar un mismo producto en el carrito !');
      }




    }


    BuscarProducto()
    {
      this.CompraService.ListaProducto(this.producto.value).subscribe(r => {
            this.listaProducto = r.data;
            this.seleccionProducto(this.listaProducto[0])
      })


    }

     //para seleccionar un producto de la lista encontrada
     seleccionProducto(producto : Producto){
      this.productoSeleccionado = this.listaProducto.filter(x=>x.id == producto.id)[0];
      this.listaProducto = [];
      this.producto.setValue("");
    }


    eliminarDetalle(detalle: DetalleCompra)
    {

        if(detalle.subTotal!)
        {
          this.totalCompra=this.totalCompra-detalle.subTotal;
          this.listadetalles=this.listadetalles.filter((item) => item.idProducto != detalle.idProducto);

          if(this.idcompra>0 && detalle.id)
          {
            this.CompraService.deleteDetalle(detalle.id).subscribe((resp:any) => {
              this.toastr.success("producto Eliminada.")
          }
          )
        }
        }
    }



    guardar ()
    {


      if(this.idcompra==0){
        if (this.form.valid && this.totalCompra>0)
        {
          this.form.value.total = this.totalCompra;

          this.compra.detalleCompra=this.listadetalles;
          this.compra.compra=this.form.value;

          this.CompraService.add(this.compra).subscribe(r => {
            this.toastr.success('compra exitosa');
            this.dialogRef.close();
          })
        }
        else{
          this.toastr.error('Porfavor complete la venta !');
        }
      }

      if(this.idcompra>0){
        if (this.form.valid && this.totalCompra>0)
        {
          this.form.value.total = this.totalCompra;

          this.compra.detalleCompra=this.listadetalles;
          this.compra.compra=this.form.value;

          this.CompraService.update(this.compra).subscribe(r => {
            this.toastr.success('edito exitosamente la venta');
            this.dialogRef.close();
          })
        }
        else{
          this.toastr.error('Porfavor complete la venta !');
        }
      }

    }


    editarDetalle(detalleSeleccionado : DetalleCompra)
    {
      this.eliminarDetalle(detalleSeleccionado);
      this.productoSeleccionado= (this.productosAux.filter(listaProductosAux=>listaProductosAux.id==detalleSeleccionado.idProducto))[0];

    }




  }


