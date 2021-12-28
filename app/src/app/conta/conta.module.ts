import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { BemvindoService } from './bemvindo/bemvindo.service';
import { BemvindoComponent } from './bemvindo/bemvindo.component';
import { CadastrarComponent } from '../telas-sem-token/cadastrar/cadastrar.component';
import { AcessarComponent } from '../telas-sem-token/acessar/acessar.component';
import { AlterarsenhaComponent } from './alterarsenha/alterarsenha.component';
import { ContaRoutingModule } from './conta.routing.module';
import { ContaComponent } from './conta.component';
import { SolicitarAcessoPFClientComponent } from './bemvindo/solicitaracessopfclient.component';
import { SolicitarAcessoPJVendorComponent } from './bemvindo/solicitaracessopjvendor.component';
import { SolicitaracessoPJClientComponent } from './bemvindo/solicitaracessopjclient.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ContaRoutingModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    }),
  ],
  declarations: [
    ContaComponent,
    AcessarComponent,
    AlterarsenhaComponent,
    BemvindoComponent,
    CadastrarComponent,
    SolicitaracessoPJClientComponent,
    SolicitarAcessoPJVendorComponent,
    SolicitarAcessoPFClientComponent
  ],
  providers:[
    BemvindoService
  ]
})
export class ContaModule { }
