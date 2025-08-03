import { CajeroAuthGuard } from './AuthGuards/cajero.auth.guard';
import { TokenInterceptor } from './token.interceptor';
import { AuthGuard } from './AuthGuards/auth.guard';
import { AdminAuthGuard } from './AuthGuards/admin.auth.guard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//routing
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
//angular material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {CdkListboxModule} from '@angular/cdk/listbox';
//componentes
import { LoginComponent } from './Componentes/login/login.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
// nginix
import { NgxBarcodeModule } from 'ngx-barcode';

//servicios
import { CategoriaComponent } from './Componentes/administration/admcategoria/categoria/categoria.component';
import { ProductoComponent } from './Componentes/administration/admproducto/producto/producto.component';
import { FormcategoriaComponent } from './Componentes/administration/admcategoria/formcategoria/formcategoria.component';
import { UsuarioComponent } from './Componentes/administration/admUsuario/usuario/usuario.component';
import { CajaComponent } from './Componentes/caja/caja.component';
import { FormproductoComponent } from './Componentes/administration/admproducto/formproducto/formproducto.component';
import { VentasComponent } from './Componentes/venta/ventas/ventas.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AddventaComponent } from './Componentes/venta/addventa/addventa.component';
import { FormUsuarioComponent } from './Componentes/administration/admUsuario/form-usuario/form-usuario.component';
import { FormCajaComponent } from './Componentes/caja/form-caja/form-caja.component';
import { ComprasComponent } from './Componentes/compra/compras/compras.component';
import { AddcompraComponent } from './Componentes/compra/addcompra/addcompra.component';
import { ReporteventaComponent } from './Componentes/venta/reporteventa/reporteventa.component';
import { StockListComponent } from './Componentes/stock/stock-list/stock-list.component';
import { CodigobarraComponent } from './Componentes/administration/admproducto/codigobarra/codigobarra.component';
import { ReporteComponent } from './Componentes/venta/reporte/reporte.component';
import { NgChartsModule } from 'ng2-charts';
import { ErrorPermisosComponent } from './Componentes/error-permisos/error-permisos.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { StockFechaComponent } from './Componentes/stock/stock-fecha/stock-fecha.component';
import { StockDetalleComponent } from './Componentes/stock/stock-detalle/stock-detalle.component';
import { ReporteCajaComponent } from './Componentes/caja/reporte-caja/reporte-caja.component';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CategoriaComponent,
    ProductoComponent,
    FormcategoriaComponent,
    UsuarioComponent,
    CajaComponent,
    FormproductoComponent,
    VentasComponent,
    AddventaComponent,
    FormUsuarioComponent,
    FormCajaComponent,
    ComprasComponent,
    AddcompraComponent,
    ReporteventaComponent,
    StockListComponent,
    CodigobarraComponent,
    ReporteComponent,
    ErrorPermisosComponent,
    StockFechaComponent,
    StockDetalleComponent,
    ReporteCajaComponent,
  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatInputModule,
    MatBadgeModule,
    MatMenuModule,
    MatBottomSheetModule,
    NgxBarcodeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkListboxModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    AppRoutingModule,
    MatPaginatorModule,
    MatSelectModule,
    NgChartsModule,
    MatGridListModule
  ],
  providers: [
    DatePipe,
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    CajeroAuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AdminAuthGuard,{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
