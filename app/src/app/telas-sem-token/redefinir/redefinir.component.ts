import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './../../shared/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClassModalService } from 'src/app/shared/modal/modal.service';

@Component({
  selector: 'app-redefinir',
  templateUrl: './redefinir.component.html',
  styleUrls: ['./redefinir.component.css']
})

export class RedefinirComponent implements OnInit {
  showSpinner: boolean = false;

  senha: string = "";
  rsenha: string = "";
  ativacao: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private modalService: ClassModalService,
  ) { }

  codigoValido = false;

  ngOnInit(): void {
    this.ativacao = "ativa" + this.route.snapshot.params["cod"];
    this.showSpinner = true;
    this.authservice.temCodigo({ 'validakey': this.ativacao }).subscribe(res => {
      if (res.detalhe != 'ok') {     
        this.router.navigate(["/home"]);
      }
      this.codigoValido = true;
      this.showSpinner = false;
    });
  }

  submeter() {
    var regexp = new RegExp('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,30}');
    if (this.senha == "") {
      this.modalService.showAlert("Entre com uma senha válida!");
      return;
    } else if (!(this.senha == this.rsenha)) {
      this.modalService.showAlert("As senhas digitadas não coincidem!");
      return;
    } else if (!regexp.test(this.senha)) {
      this.modalService.showAlert("A senha deve conter de 5 a 30 dígitos, no mínimo uma letra maiúscula um letra minúscula e um número!");
      return;
    }
    //  this.showSpinner = true;
    this.authservice.redefineSenha({ 'password': this.senha, 'validakey': this.ativacao }).subscribe(res => {
      if (res.detalhe == "ok") {
        this.modalService.showSuccess("Senha alterada com sucesso!")
        .subscribe(()=> this.router.navigate(["/acessar"]) );
      }

      this.showSpinner = false;
    });
  }
}
