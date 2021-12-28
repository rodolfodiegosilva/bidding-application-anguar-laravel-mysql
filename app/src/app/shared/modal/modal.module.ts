import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './alert/alert-modal.component';
import { ConfirmModalComponent } from './confirm/confirm-modal.component';
import { SuccessModalComponent } from './success/success-modal.component';
import { ConfirmDateComponent } from './confirm-date/confirm-date.component';



@NgModule({
  declarations: [ModalModule],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalModule,
  ],
  entryComponents: [AlertModalComponent, ConfirmModalComponent, SuccessModalComponent, ConfirmDateComponent]
})
export class ModalModule { }
