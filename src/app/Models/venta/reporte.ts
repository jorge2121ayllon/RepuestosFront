import { Producto } from "../Administration/producto";

export class Reporte{

  ganancias : number[] =[];
  venta: number[] =[];
  inversion: number[] =[];
  etiquetas: string[] =[];
  cantidad!: number;
  producto!: Producto ;

  categorias: string[] =[];
  cantidadCategorias: number[] =[];
}
