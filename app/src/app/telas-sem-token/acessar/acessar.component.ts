import { ClassModalService } from './../../shared/modal/modal.service';
import { AlertModalComponent } from '../../shared/modal/alert/alert-modal.component';
import { Estados } from '../../shared/models/user-model';
import { catchError, switchMap, take } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ClassUser, ResponseUser } from '../../shared/models/user-model';
import { AuthService } from '../../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-acessar',
  templateUrl: './acessar.component.html',
  styleUrls: ['./acessar.component.css']
})

export class AcessarComponent implements OnInit {

  showSpinner = false;

  respostaUsuario: ResponseUser;
  retorno = 'NULL';
  f: FormGroup;
  email: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public modalService: ClassModalService
  ) { }

  ngOnInit(): void {
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  submeter() {
    // console.log(1);
    if (!this.f.controls.email.valid) {
      // console.log(2);
      this.modalService.showAlert('Entre com o seu Email!');
      return;
    } else if (!this.f.controls.password.valid) {
      // console.log(3);
      this.modalService.showAlert('Entre com a sua senha!');
      return;
    }

    this.showSpinner = true;
    console.log(this.f.controls.email.value);
    this.authService.requestdeLogin(this.f.value).subscribe(
      (res) => {
        if (this.authService.getUserStatus() === Estados.Criado) {
          const result$ = this.modalService.showConfirm('Sua conta ainda não foi checada. Verifique o seu e-mail para validação do seu cadastro ou reenviar e-mail?');
          this.showSpinner = true;
          result$.asObservable()
            .pipe(
              take(1),
              switchMap(res => (res === false) || (res === null) ? EMPTY : this.authService.enviaEmailConfirmacao(this.f.controls.email.value))
            )
            .subscribe(res => {
              this.showSpinner = false;
              if (res.detalhe === 'ok') {
                this.modalService.showSuccess('E-mail enviado com sucesso', 'Sucesso')
                  .subscribe(() => window.location.reload());
              } else {
                // window.location.reload();
              }
            },
              (errorResponse: HttpErrorResponse) => {
                const error = errorResponse.error;
                this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
                this.showSpinner = false;
                // window.location.reload();
              });
        } else if ([Estados.Checado, Estados.Aguardando, Estados.Aprovado].includes(this.authService.getUserStatus())) {
          this.authService.redirecionaParaZona();
        } else if (Estados.Bloqueado == this.authService.getUserStatus()) {
          this.modalService.showAlert('Sua conta foi bloqueada.', 'Bloqueio')
            .subscribe(() => window.location.reload());
        } else if (Estados.Reprovado == this.authService.getUserStatus()) {
          this.modalService.showAlert('Sua conta foi Reprovada.', 'Que chato')
            .subscribe(() => window.location.reload());
        } else {
          alert('Erro: #11');
        }
        this.showSpinner = false;
      },
      (errorResponse: HttpErrorResponse) => {
        // console.log(errorResponse);
        if (errorResponse.error) {
          const error = errorResponse.error.detalhe;
          console.log(error);
          if (error === 'invalid_credentials') {
            // console.log(12);
            this.modalService.showAlert('Usuário ou senha inválido!', 'ERRO');
            //  console.log(errorResponse.error.detalhe);
          } else {
            // console.log(13);
            this.modalService.showAlert(errorResponse.error.detalhe);
            console.log(errorResponse);
          }

        }
        this.showSpinner = false;
      });
  }

  recuperasenha() {
    if (this.f.controls.email.valid) {
      this.router.navigate(['/recuperar'], { queryParams: { email: this.f.controls.email.value } });
    } else {
      this.router.navigate(['/recuperar']);
    }
  }
}
