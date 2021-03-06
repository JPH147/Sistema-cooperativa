import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobranzasListarComponent } from './cobranzas-listar/cobranzas-listar.component';
import { CobranzaDirectaListarComponent } from './cobranza-directa-listar/cobranza-directa-listar.component';
import { CobranzaDirectaComponent } from './cobranza-directa/cobranza-directa.component';
import { CobranzaArchivosListarComponent } from './cobranza-archivos-listar/cobranza-archivos-listar.component';
import { CobranzaArchivosDetalleComponent } from './cobranza-archivos-detalle/cobranza-archivos-detalle.component';
import { CobranzaArchivosComponent } from './cobranza-archivos/cobranza-archivos.component';
import { CobranzaArchivosPagoComponent } from './cobranza-archivos-pago/cobranza-archivos-pago.component';
import { CobranzaJudicialListarComponent } from './cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialMultipleComponent } from './cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { CobranzaJudicialGenerarComponent } from './cobranza-judicial-generar/cobranza-judicial-generar.component';
import { CobranzaManualListarComponent } from './cobranza-manual-listar/cobranza-manual-listar.component';
import { CobranzaManualComponent } from './cobranza-manual/cobranza-manual.component';
import { LiquidacionesComponent } from './liquidaciones/liquidaciones.component';

const routes: Routes = [
  {path: '', redirectTo: 'listado', pathMatch: 'full'} ,
  {path: 'listado', component: CobranzasListarComponent},
  {path: 'cobranza-directa', component: CobranzaDirectaListarComponent},
  {path: 'cobranza-directa/nueva', component: CobranzaDirectaComponent},
  {path: 'cobranza-directa/ver/:idcobranza', component: CobranzaDirectaComponent},
  {path: 'cobranza-directa/editar/:idcobranzaeditar', component: CobranzaDirectaComponent},
  {path: 'cobranza-archivos', component: CobranzaArchivosListarComponent},
  {path: 'cobranza-archivos/ver/:idcobranza', component: CobranzaArchivosDetalleComponent},
  {path: 'cobranza-archivos/generar', component: CobranzaArchivosComponent},
  {path: 'cobranza-archivos/cobrar/:id', component: CobranzaArchivosPagoComponent},
  {path: 'cobranza-judicial', component: CobranzaJudicialListarComponent},
  {path: 'cobranza-judicial/ver/:idprocesover', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/editar/:idprocesoeditar', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/agregar/:idprocesoagregar', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nuevo-multiple', component: CobranzaJudicialMultipleComponent},
  {path: 'cobranza-judicial/nueva-credito/:idcredito', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/venta/:idventa', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/salida/:idventasalida', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/generar/nuevo/:idprocesonuevo', component: CobranzaJudicialGenerarComponent},
  {path: 'cobranza-judicial/generar/ver/:idprocesover', component: CobranzaJudicialGenerarComponent},
  {path: 'cobranza-manual', component: CobranzaManualListarComponent},
  {path: 'cobranza-manual/ver/:idcobranza', component: CobranzaManualComponent},
  {path: 'liquidaciones', component: LiquidacionesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloCobranzasRoutingModule { }
