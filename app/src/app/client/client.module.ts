import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';

import { ClientGuard } from './client.guard';
import { ClientRoutingModule } from './client.routing.module';
import { ClientComponent } from './client.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { ClientService } from './client.service';
import { PerfilClientComponent } from './perfil/perfil-client.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientRoutingModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    }),
  ],
  declarations: [
    ClientComponent,
    OrcamentosComponent,
    DetalhesComponent,
    PerfilClientComponent
  ],
  exports: [],
  providers: [
    ClientGuard,
    ClientService
  ]
})

export class ClientModule { }
