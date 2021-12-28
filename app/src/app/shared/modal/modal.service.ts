import { SuccessModalComponent } from './success/success-modal.component';
import { Injectable } from '@angular/core';
import { AlertModalComponent } from './alert/alert-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './confirm/confirm-modal.component';
import { ConfirmDateComponent } from './confirm-date/confirm-date.component';
import { ResponseDate } from '../models/user-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClassModalService {

  constructor(
    private bsModalService: BsModalService,
  ) { }

  showConfirm(msg: string, title?: string, okTxt?: string, closeTxt?: string) {
    const bsModalRef: BsModalRef = this.bsModalService.show(ConfirmModalComponent);
    bsModalRef.content.msg = msg;

    if (title) { bsModalRef.content.title = title; }
    if (okTxt) { bsModalRef.content.okTxt = okTxt; }
    if (closeTxt) { bsModalRef.content.closeTxt = closeTxt; }

    return (bsModalRef.content as ConfirmModalComponent).confirmResult;
  }


  showConfirmDate(msg: string, title?: string, okTxt?: string, closeTxt?: string): ResponseDate {
    const bsModalRef: BsModalRef = this.bsModalService.show(ConfirmDateComponent);
    bsModalRef.content.msg = msg;
    if (title === 'Reativação de Cotação') {
      bsModalRef.content.title = title;
      bsModalRef.content.reativacaoCotacao = true;
    }
    if (title === 'Visita para o Serviço') {
      bsModalRef.content.title = title;
      bsModalRef.content.visisiaServico = true;
    }

    return (bsModalRef.content as ConfirmDateComponent).confirmResult;
  }

  showAlert(msg: string, title?: string, okTxt?: string) {
    const bsModalRef: BsModalRef = this.bsModalService.show(AlertModalComponent);
    bsModalRef.content.msg = msg;

    if (title) { bsModalRef.content.title = title; }
    if (okTxt) { bsModalRef.content.okTxt = okTxt; }

    return (bsModalRef.content as ConfirmModalComponent).confirmResult;
  }

  showSuccess(msg: string, title?: string, okTxt?: string) {
    const bsModalRef: BsModalRef = this.bsModalService.show(SuccessModalComponent);
    bsModalRef.content.msg = msg;

    if (title) { bsModalRef.content.title = title; }
    if (okTxt) { bsModalRef.content.okTxt = okTxt; }

    return (bsModalRef.content as ConfirmModalComponent).confirmResult;
  }
}
