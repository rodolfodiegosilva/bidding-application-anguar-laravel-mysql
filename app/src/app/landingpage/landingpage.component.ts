import { environment } from 'src/environments/environment';
import { LandingpageService } from './landingpage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassModalService } from '../shared/modal/modal.service';


declare var jQuery: any;

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {


  showSpinner: boolean = false;

  formContato: FormGroup;
  appversao = environment.version;

  constructor(
    private formBuilder: FormBuilder,
    private landingpageService: LandingpageService,
    private modalService: ClassModalService
  ) { }

  ngOnInit(): void {
    this.formContato = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      tel: [null, [Validators.required]],
      mensagem: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(400)]]
    });
  }
  solicitar() {

    if (!this.formContato.controls.email.valid) {
      this.modalService.showAlert("Email obrigatório!");
      return;
    } else if (!this.formContato.controls.tel.valid) {
      this.modalService.showAlert("Informe um Telefone/Celular válido!");
      return;
    } else if (!this.formContato.controls.mensagem.valid) {

      this.modalService.showAlert("Digite uma menssagem entre 5 e 400 caracteres!");
      return;
    }

    this.showSpinner = true;

    this.landingpageService.sendSoliContato(this.formContato.value).subscribe(res => {

      if (res.detalhe == "ok") {
        this.modalService.showSuccess("Solicitação de contato enviada com Sucesso!");
        this.formContato.reset();
        this.showSpinner = false;
      }

    },
      (errorResponse: HttpErrorResponse) => {

        // console.log(errorResponse.error);
        const error = errorResponse.error;
        this.modalService.showAlert('Algum erro a tratar!');

        this.showSpinner = false;

      });
  }

}
