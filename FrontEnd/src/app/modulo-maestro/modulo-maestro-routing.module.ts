import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantillasComponent } from './plantillas/plantillas.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { TalonariosComponent } from './talonarios/talonarios.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { DireccionesComponent } from './direcciones/direcciones.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { ProcesoJudicialVinculadosComponent } from './proceso-judicial-vinculados/proceso-judicial-vinculados.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReglasEvaluacionComponent } from './reglas-evaluacion/reglas-evaluacion.component';
import { CooperativaConfiguracionComponent } from './cooperativa-configuracion/cooperativa-configuracion.component';
import { BancosComponent } from './bancos/bancos.component';
import { CentrosTrabajoComponent } from './centros-trabajo/centros-trabajo.component';


const routes: Routes = [
  {path: '', redirectTo: 'configuracion', pathMatch: 'full'} ,
  {path: 'plantillas', component: PlantillasComponent} ,
  {path: 'configuracion', component: CooperativaConfiguracionComponent} ,
  {path: 'bancos', component: BancosComponent} ,
  {path: 'trabajadores', component: VendedoresComponent} ,
  {path: 'talonarios', component: TalonariosComponent} ,
  {path: 'proveedores', component: ProveedoresComponent} ,
  {path: 'direcciones', component: DireccionesComponent} ,
  {path: 'instituciones', component: InstitucionesComponent} ,
  {path: 'centros-trabajo', component: CentrosTrabajoComponent} ,  
  {path: 'proceso-judicial-vinculados', component: ProcesoJudicialVinculadosComponent} ,
  {path: 'usuarios', component: UsuariosComponent} ,
  {path: 'evaluacion-reglas', component: ReglasEvaluacionComponent} ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloMaestroRoutingModule { }
