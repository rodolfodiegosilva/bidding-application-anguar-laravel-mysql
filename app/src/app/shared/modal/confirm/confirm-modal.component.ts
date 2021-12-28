import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  @Input() title: string = 'Confirmação';
  @Input() msg: string = '';
  @Input() closeTxt: string = 'Cancelar';
  @Input() okTxt: string = 'Ok';

  confirmResult: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnDestroy() {
    this.confirmAndClose(null);
  }
  ngOnInit(): void {
    this.confirmResult = new Subject<boolean>();
  }
  onSim() {
    this.confirmAndClose(true);
  }
  onClose() {
    this.confirmAndClose(null);
  }
  onNao() {
    this.confirmAndClose(false);
  }

  private confirmAndClose(value: boolean) {
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
