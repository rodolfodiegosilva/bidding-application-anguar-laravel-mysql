import { ClassModalService } from 'src/app/shared/modal/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassUser } from '../shared/models/user-model';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Menucontainer',
  templateUrl: './container-Menu.component.html',
  styleUrls: [
    './container-Menu.component.css'
  ]
})

export class ContainerMenuComponent implements OnInit {

  tipodeConta: string;
  tipopessoa: string;
  url = './assets/improfile.jpg';

  constructor(private authService: AuthService,
              private modalservice: ClassModalService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.carregaImgProfile();
    if (!this.authService.usuario) {
      this.authService.lerLogin();
    }
  }


  getEmailUsuario() {
    return this.authService.usuario.email;
  }

  isCheck() {
    this.tipodeConta = this.authService.usuario.tipoconta;
    this.tipopessoa = this.authService.usuario.tipopessoa;
    return parseInt(this.authService.getUserStatus()) > 2;
  }

  adminEstaAtivo(){
    return this.authService.adminEstaAtivo()
  }

  usuarioEstaAutenticado() {
    return this.authService.usuarioEstaAutenticado();
  }
  clientEstaAtivo() {
    return this.authService.clientEstaAtivo();
  }
  vendorEstaAtivo() {
    return this.authService.vendorEstaAtivo();
  }

  logOut() {
    this.authService.fazerLogOff().subscribe(
      (res:any) =>{
        this.authService.desautenticaUser();
        this.router.navigate(['/acessar']);
      },
      (errorResponse: HttpErrorResponse) => {
        this.authService.desautenticaUser();
        this.router.navigate(['/acessar']);
      }
    );
  }

  carregaImgProfile() {
    this.authService.pegaProfile().subscribe((res) => {
        if (res.user) {
          if (res.user.foto != 'null') {
            this.url = res.user.foto;
          }
        } else {
          this.modalservice.showAlert('Erro no servidor', 'ERRO');
        }},(errorResponse: HttpErrorResponse) => { });
  }

}
