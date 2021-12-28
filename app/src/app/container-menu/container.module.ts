import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil/perfil.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerRoutingModule } from './container-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';


@NgModule({
  declarations: [    
    PerfilComponent, UsuariosComponent,
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    }),
  ]
})
export class ContainerModule { }
