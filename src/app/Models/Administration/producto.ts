export interface Producto{
    id:number,
    precioCompra:number
    precioVenta:number
    marca?:string
    descripcion:string
    stock:number
    stockMinimo:number
    codigo:string
    codigoInterno:string
    fechaMovimiento:Date;
    unidad?:string
    idCategoria?:number



}
