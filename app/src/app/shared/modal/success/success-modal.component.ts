import { Component, OnInit, Input } from '@angular/core';
import {  BsModalRef } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {

  @Input() title: string = 'Sucesso';
  @Input() msg: string = '';
  @Input() okTxt: string = 'Ok';

  confirmResult: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnDestroy() {
    this.confirmAndClose(false);
  }

  ngOnInit(): void {
    this.confirmResult = new Subject();
  }

  onClose() {
    this.confirmAndClose(false);
  }

  private confirmAndClose(value:boolean){
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
