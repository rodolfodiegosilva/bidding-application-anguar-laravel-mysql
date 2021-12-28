import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContainerMenuComponent } from 'src/app/container-menu/container-menu.component';
import { AuthService } from 'src/app/shared/auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-alterarsenha',
  templateUrl: './alterarsenha.component.html',
  styleUrls: ['./alterarsenha.component.css']
})
export class AlterarsenhaComponent implements OnInit {
  @ViewChild('mensagemModal') mensagemModal: ElementRef;
  objModal = {
    'titulo': '',
    'mensagem': '',
    'tituloClass': {
      'bg-danger': true,
      'bg-primary': false,
    },
    'btnClass': {
      'btn-danger': true,
      'btn-primary': false,
    }
  };
  showSpinner: boolean = false;
  asenha: string = "";
  senha: string = "";
  rsenha: string = "";
  ativacao: string;
  btativalink :boolean = false;
  constructor(
    private authservice: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  submeter() {
    var regexp = new RegExp('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,30}');

    if (this.asenha == "") {
      this.mostraModal("Alerta", "Entre com a senha atual!", "alerta");
      return;
    } else if (this.asenha == "") {
      this.mostraModal("Alerta", "Entre com a nova senha!", "alerta");
      return;
    } else if (!(this.senha == this.rsenha)) {
      this.mostraModal("Alerta", "As senhas digitadas não coincidem!", "alerta");
      return;
    } else if (!regexp.test(this.senha)) {
      this.mostraModal("Alerta", "A senha deve conter de 5 a 30 dígitos, no mínimo uma letra maiúscula um letra minúscula e um número!", "alerta");
      return;
    }
    this.showSpinner = false;
    this.authservice.alterarSenha({ 'email': this.authservice.usuario.email ,'atual': this.asenha,'nova': this.rsenha}).subscribe(res => {
      if (res.msg == "ok") {
      // this.router.navigate([this.authservice.usuario.tipoConta ]);
        this.mostraModal("Sucesso","Senha salva com sucesso.","sucesso");
      }else{
        this.mostraModal("Alerta",res.msg,"alerta");
      }
      this.showSpinner = false;
    });
  }

  mostraModal(titulo: string, mensagem: string, tipo) {
    this.objModal.titulo = titulo;
    this.objModal.mensagem = mensagem;
    if (tipo == "alerta") {
      this.objModal.tituloClass["bg-danger"] = true;
      this.objModal.tituloClass["bg-primary"] = false;
      this.objModal.btnClass["btn-danger"] = true;
      this.objModal.btnClass["btn-primary"] = false;
      this.btativalink = false;
    } else {
      this.objModal.tituloClass["bg-danger"] = false;
      this.objModal.tituloClass["bg-primary"] = true;
      this.objModal.btnClass["btn-danger"] = false;
      this.objModal.btnClass["btn-primary"] = true;
      this.btativalink = true;
    }
    jQuery(this.mensagemModal.nativeElement).modal("show");
  }

}
