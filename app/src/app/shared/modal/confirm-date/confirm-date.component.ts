import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-date',
  templateUrl: './confirm-date.component.html',
  styleUrls: ['./confirm-date.component.css']
})
export class ConfirmDateComponent implements OnInit {

  @Input() title: string = 'Confirmação';
  @Input() msg: string = '';
  @Input() closeTxt: string = 'Cancelar';
  @Input() okTxt: string = 'Ok';
  @Input() reativacaoCotacao = false;
  @Input() visisiaServico = false;

  confirmResult: any = [];

  showdata = true;
  datainicio: any;
  datafim: any;
  dataentrega: any;

  myForm: FormGroup;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.confirmResult = new Subject<boolean>();
  }
  ngOnDestroy() {
    this.confirmAndClose(null, null, null, null);
  }
  showData() {
    this.showdata = false;
  }
  hiddenData() {
    this.showdata = true;
  }

  onSim() {
    console.log(this.datainicio);
    console.log(this.datafim);
    this.confirmAndClose(true, this.datainicio, this.datafim, this.dataentrega);
  }
  salvaDataInicio(data){
    this.datainicio = data;
  }
  salvaDataFim(data){
    this.datafim = data;
  }
  salvaDataEntrega(data){
    this.dataentrega = data;
  }
  onClose() {
    this.confirmAndClose(null, null, null, null);
  }
  onNao() {
    this.confirmAndClose(false, null, null, null);
  }

  private confirmAndClose(aux1: boolean, aux2, aux3, aux4) {
    const value ={
      value: aux1,
      datainicio: aux2,
      datafim: aux3,
      dataentrega: aux4
    }
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }


}
