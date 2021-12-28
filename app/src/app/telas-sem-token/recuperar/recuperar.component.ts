import { AuthService } from './../../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  showSpinner: boolean = false;
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
  @ViewChild('mensagemModal') mensagemModal: ElementRef;

  email: string = "";
  @ViewChild('myModal') myModal: ElementRef;


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const email =this.route.snapshot.queryParams['email'];
    if(email){
      this.email = email;
    }
  }

  mostraModal(titulo, mensagem, tipo) {
    this.objModal.titulo = titulo;
    this.objModal.mensagem = mensagem;
    if (tipo == "alerta") {
      this.objModal.tituloClass["bg-danger"] = true;
      this.objModal.tituloClass["bg-primary"] = false;
      this.objModal.btnClass["btn-danger"] = true;
      this.objModal.btnClass["btn-primary"] = false;
    } else {
      this.objModal.tituloClass["bg-danger"] = false;
      this.objModal.tituloClass["bg-primary"] = true;
      this.objModal.btnClass["btn-danger"] = false;
      this.objModal.btnClass["btn-primary"] = true;
    }
    jQuery(this.mensagemModal.nativeElement).modal("show");
  }

  submeter() {
    if (this.email == "") {
      this.mostraModal("Alerta", "Entre com o Email!", "alerta");
      return;
    }
    this.showSpinner = true;
    this.authService.recuperarSenha(this.email).subscribe(res => {
      if(res.detalhe=="ok"){
        jQuery(this.myModal.nativeElement).modal('show');
      }else{
        this.mostraModal("Alerta", res.detalhe, "alerta");
      }
      this.showSpinner = false;
    });


    //
  }

  toLogin() {
    this.router.navigate(["acessar"]);
  }

}
