import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LiberacaoComponent } from './liberacao/liberacao.component';

const AdminRouting: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: 'liberacao', component: LiberacaoComponent },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(AdminRouting)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
