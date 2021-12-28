
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientComponent } from './client.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { AlterarsenhaComponent } from '../conta/alterarsenha/alterarsenha.component';
import { UsuariosComponent } from './../container-menu/usuarios/usuarios.component';
import { PerfilClientComponent } from './perfil/perfil-client.component';

const ClientRoutes: Routes = [
  {
    path: '', component: ClientComponent, children: [
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'detalhes', component: DetalhesComponent },
      { path: 'detalhes/:id', component: DetalhesComponent },
      { path: 'conta', component: PerfilClientComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'alterarsenha', component: AlterarsenhaComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(ClientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
