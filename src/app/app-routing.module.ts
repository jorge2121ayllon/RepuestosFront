import { CajeroAuthGuard } from './AuthGuards/cajero.auth.guard';
import { AuthGuard } from './AuthGuards/auth.guard';
import { AdminAuthGuard } from './AuthGuards/admin.auth.guard';
import { ReporteventaComponent } from './Componentes/venta/reporteventa/reporteventa.component';
import { AddventaComponent } from './Componentes/venta/addventa/addventa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Componentes/login/login.component';
import { CategoriaComponent } from './Componentes/administration/admcategoria/categoria/categoria.component';
import { VentasComponent } from './Componentes/venta/ventas/ventas.component';
import { UsuarioComponent } from './Componentes/administration/admUsuario/usuario/usuario.component';
import { ProductoComponent } from './Componentes/administration/admproducto/producto/producto.component';
import { CajaComponent } from './Componentes/caja/caja.component';
import { ComprasComponent } from './Componentes/compra/compras/compras.component';
import { StockListComponent } from './Componentes/stock/stock-list/stock-list.component';
import { StockFechaComponent } from './Componentes/stock/stock-fecha/stock-fecha.component';
import { ReporteComponent } from './Componentes/venta/reporte/reporte.component';
import { ErrorPermisosComponent } from './Componentes/error-permisos/error-permisos.component';
import { StockDetalleComponent } from './Componentes/stock/stock-detalle/stock-detalle.component';
import { ReporteCajaComponent } from './Componentes/caja/reporte-caja/reporte-caja.component';
const routes: Routes = [
  { path: 'error', component: ErrorPermisosComponent, pathMatch: "full" },
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  //probando
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  //PARA AMBOS ROLES DE USUARIOS
 
  { path: 'producto', component: ProductoComponent, pathMatch: "full" ,canActivate: [AuthGuard]},
  { path: 'stock', component: StockListComponent, pathMatch: "full",canActivate: [AuthGuard] },
  { path: 'venta', component: VentasComponent, pathMatch: "full",canActivate: [AuthGuard] },
  { path: 'addventa', component: AddventaComponent, pathMatch: "full" ,canActivate: [AuthGuard]},
  { path: 'caja', component: CajaComponent, pathMatch: "full",canActivate: [AuthGuard] },
  { path: 'reporteCaja', component: ReporteCajaComponent, pathMatch: "full",canActivate: [AuthGuard] },
  // SOLO PARA USUARIO ADMINISTRADOR
  { path: 'usuario', component: UsuarioComponent, pathMatch: "full" ,canActivate: [AdminAuthGuard]},
  { path: 'reporte', component: ReporteComponent, pathMatch: "full",canActivate: [AdminAuthGuard] },
  { path: 'categoria', component: CategoriaComponent, pathMatch: "full" ,canActivate: [AdminAuthGuard] },
  { path: 'compra', component: ComprasComponent, pathMatch: "full",canActivate: [AdminAuthGuard] },
  { path: 'stockDetalle', component: StockDetalleComponent, pathMatch: "full",canActivate: [AdminAuthGuard] },
  { path: 'stockFecha', component: StockFechaComponent, pathMatch: "full",canActivate: [AdminAuthGuard] },
  { path: 'reporteventa', component: ReporteventaComponent, pathMatch: "full",canActivate: [AdminAuthGuard] },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
