import { MascUtil } from './../../shared/mascaraUtil';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { FormValidator } from 'src/app/shared/form-validator';
import { MascaraUtil } from 'src/app/shared/mascaraUtil';
import { ClassModalService } from 'src/app/shared/modal/modal.service';

declare var jQuery: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {

  showSpinner = false;

  url: any = './assets/improfile.jpg';
  camerawhite = './assets/camera-white.jpg';
  file = null;

  trocarFoto = true;
  tipoPessoa: any;
  ehChildren = null;

  public masktelefone = MascaraUtil.mascTelefone;
  public maskcnpj = MascaraUtil.mascCnpj;
  public maskcep = MascaraUtil.mascCep;
  public termocheck: boolean;
  formulario: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private authservice: AuthService,
    private modalservice: ClassModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this.formbuilder.group({
      name: ['', Validators.required],
      apelido: ['', Validators.required],
      email: ['', Validators.email],
      telefone: ['', [Validators.required]], // Validators.pattern(MascUtil.telefone.valid)]],
      profissao: ['', Validators.required],
      pais: ['', Validators.required],
      nomeempresa: ['', Validators.required],
      cnpj: ['', [Validators.required]], // Validators.pattern(MascUtil.cnpj.valid)]],
      cpf: ['', [Validators.required]], // Validators.pattern(MascUtil.cpf.valid)]],
      endereco: [''],
      bairro: [''],
      complemento: [''],
      cep: [''],
      cidade: [''],
      estado: [''],
      validade: [''],
      foto: [null]
    });
    this.carregaDadosUser();
  }

  carregaDadosUser() {
    this.showSpinner = true;
    this.authservice.pegaProfile().subscribe(
      (res) => {
        console.log(res.user);
        if (res.user) {
          this.formulario.controls.name.setValue(res.user.name);
          this.formulario.controls.telefone.setValue(res.user.telefone);
          this.formulario.controls.email.setValue(res.user.email);
          this.formulario.controls.nomeempresa.setValue(res.user.nomeempresa);
          this.formulario.controls.cnpj.setValue(res.user.cnpj);
          this.formulario.controls.cpf.setValue(res.user.cpf);
          this.formulario.controls.endereco.setValue(res.user.endereco);
          this.formulario.controls.bairro.setValue(res.user.bairro);
          this.formulario.controls.complemento.setValue(res.user.complemento);
          this.formulario.controls.cep.setValue(res.user.cep);
          this.formulario.controls.cidade.setValue(res.user.cidade);
          this.formulario.controls.estado.setValue(res.user.estado);
          this.formulario.controls.pais.setValue(res.user.pais);
          this.formulario.controls.profissao.setValue(res.user.profissao);
          this.formulario.controls.foto.setValue('null');
          this.tipoPessoa = res.user.tipopessoa;
          this.ehChildren = res.user.id_parent;

          if (res.user.foto !== 'null') {
            this.url = res.user.foto;
          }
        } else {
          alert('Erro no servidor');
        }
        this.showSpinner = false;
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.showSpinner = false;
      }
    );

  }

  onSubmit() {

    /*if (!this.termocheck) {
      this.modalservice.showAlert("Você precisa aceitar os termos para continuar.");
      return;
    }*/
    this.showSpinner = true;
    this.authservice.salvaMeusDados(this.formulario.value).subscribe(res => {
      if (res.detalhe === 'updateok') {
        this.authservice.atualizaUsuario(res.user);
        this.modalservice.showSuccess('Dados atualizados com sucesso!', 'Atualização')
        .subscribe(() => window.location.reload());
      } else {
        console.log('updade erro!');
        return;
      }
      this.showSpinner = false;
    });
  }

  sair() {
    window.location.reload();
  }

  onTrocaImg(event) {
    this.trocarFoto = false;
    const selectedFiles = <FileList>event.srcElement.files;
    if (selectedFiles.length > 0) {
      this.getBase64(selectedFiles[0]).then(
        data => {
          this.formulario.controls.foto.setValue(data);
          this.url = data;
        }
      );
     // this.onSubmit();
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
