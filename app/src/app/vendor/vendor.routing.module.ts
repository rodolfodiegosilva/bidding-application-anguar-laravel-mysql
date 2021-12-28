import { PerfilComponent } from '../container-menu/perfil/perfil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendorComponent } from './vendor.component';
import { ClassificadosComponent } from './classificados/classificados.component';
import { AlterarsenhaComponent } from '../conta/alterarsenha/alterarsenha.component';
import { UsuariosComponent } from './../container-menu/usuarios/usuarios.component';

const VendorRoutes: Routes = [
  { path: '', component: VendorComponent , children:[
    { path: 'classificados', component: ClassificadosComponent },
    { path: 'conta', component: PerfilComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'alterarsenha', component: AlterarsenhaComponent }
  ]}


];

@NgModule({
  imports: [RouterModule.forChild(VendorRoutes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
