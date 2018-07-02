import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductosComponent } from './components/productos/productos.component';
import { StockComponent } from './components/stock/stock.component';
import { IngresoProductosComponent } from './components/ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component'

const appRoutes: Routes = [
  {path:'', component: UsuariosComponent},
  {path:'productos', component: ProductosComponent},
  {path:'stock', component: StockComponent},
  {path:'ingresoproductos', component: IngresoProductosComponent},
  {path:'salidaproductos', component: SalidaProductosComponent},
  {path:'salidavendedores', component: SalidaVendedoresComponent},
  {path:'retornovendedores', component: RetornoVendedoresComponent},
  {path:'comisiones', component: ComisionesComponent},
  {path:'clientes', component: ClientesComponent},
  {path:'ventas', component: VentasComponent},
  {path:'usuarios', component: UsuariosComponent},
]

export const appRoutingProvider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);