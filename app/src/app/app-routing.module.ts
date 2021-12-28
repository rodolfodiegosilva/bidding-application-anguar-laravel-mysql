import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitarAcessoPFClientComponent } from './conta/bemvindo/solicitaracessopfclient.component';

import { RecuperarComponent } from './telas-sem-token/recuperar/recuperar.component';

import { ClientGuard } from './client/client.guard';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ValidarComponent } from './telas-sem-token/validar/validar.component';
import { AcessarComponent } from './telas-sem-token/acessar/acessar.component';
import { CadastrarComponent } from './telas-sem-token/cadastrar/cadastrar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { VendorGuard } from './vendor/vendor.guard';
import { AuthGuardFreeZone } from './guards/auth.guard.FreeZone';
import { AdminGuard } from './admin/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { RedefinirComponent } from './telas-sem-token/redefinir/redefinir.component';

const routes: Routes = [
  {
    path: 'vendor',
    loadChildren: () => import('./vendor/vendor.module').then(mod => mod.VendorModule),
    canActivate: [VendorGuard],
    canActivateChild: [VendorGuard],
    canLoad: [VendorGuard]
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then(mod => mod.ClientModule),
    canActivate: [ClientGuard],
    canActivateChild: [ClientGuard],
    canLoad: [ClientGuard]
  },
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module').then(mod => mod.ContaModule),
     canActivate: [AuthGuard],
     canLoad: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
    //canActivate: [AdminGuard],
    canLoad: [AdminGuard]
  },

  { path: 'validar', component: ValidarComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'recuperar/:email', component: RecuperarComponent },
  { path: 'redefinir/:cod', component: RedefinirComponent },

  { path: 'home', component: LandingpageComponent, canActivate: [AuthGuardFreeZone] },
  { path: 'acessar', component: AcessarComponent, canActivate: [AuthGuardFreeZone] },
  { path: 'cadastrar', component: CadastrarComponent, canActivate: [AuthGuardFreeZone] },
  { path: 'validar/:cod', component: ValidarComponent, canActivate: [AuthGuardFreeZone] },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: PaginaNaoEncontradaComponent, canActivate: [AuthGuardFreeZone] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
