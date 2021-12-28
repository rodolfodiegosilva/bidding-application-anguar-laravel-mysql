import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { LiberacaoComponent } from './liberacao/liberacao.component';

import { AdminRoutingModule } from './admin.routing.module';
import { AdminGuard } from './admin.guard';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    LiberacaoComponent,

  ],
  providers: [
    AdminGuard
  ]
})
export class AdminModule { }
