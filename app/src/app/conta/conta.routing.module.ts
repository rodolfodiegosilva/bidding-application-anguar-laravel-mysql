import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BemvindoComponent } from './bemvindo/bemvindo.component';
import { AlterarsenhaComponent } from './alterarsenha/alterarsenha.component';
import { ContaComponent } from './conta.component';

const ContaRouting: Routes = [
  {
    path: '', component: ContaComponent, children: [
        { path: 'bemvindo', component: BemvindoComponent },
        { path: 'alterarsenha', component: AlterarsenhaComponent },
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(ContaRouting)],
  exports: [RouterModule]
})
export class ContaRoutingModule { }
