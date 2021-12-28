import { ClassModalService } from './../../shared/modal/modal.service';
import { AuthService } from './../../shared/auth.service';
import { UsuariosService } from './usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
//import { FormValidator } from 'src/app/shared/form-validator';
import { CustomValidators } from 'src/app/shared/customvalidators/custom-validators';
import { switchMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  showSpinner = false;
  formUser: FormGroup;
  formUserChild: FormGroup;
  formulario: FormGroup;
  myFormulario: FormGroup;
  tipoconta: any;
  listaUsers = [];
  editaUser = false;


  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private modalService: ClassModalService,
    private usuariosService: UsuariosService
  ) {  }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      idParent: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [ null, Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        Validators.minLength(5)])
        ],
      confirmPassword: [null, Validators.compose([Validators.required])],
      telefone: ['', Validators.required],
      tipoconta: [''],
      tipopessoa: [''],
      cpf: [''],
      novousuario: true,
      editarUser: [false],
      idUser: [''],
      tipouser: ['']
    },
    {
        validator: CustomValidators.passwordMatchValidator
    });

    this.formulario = this.formBuilder.group({
      id:[''],
      nome: ['', Validators.required],
      apelido: ['', Validators.required],
      email: ['', Validators.email],
      telefone: ['', [Validators.required, Validators.pattern('^\\([1-9]{2}\\) [0-9]{0,1} [0-9]{4}-[0-9]{4}$')]],
      nomeempresa: ['', Validators.required],
      cnpj: ['', [Validators.required]],
      segmento: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
    });

    this.formUserChild = this.formBuilder.group({
      id: [''],
      name: [''],
      email: [''],
      telefone: [''],
      nomeempresa: [''],
      tipoconta: [''],
      status: [''],
      cnpj: [''],
      cpf: [''],
      endereco: [''],
      cidade: [''],
      estado: [''],
      pais: [''],
      cep: ['']
    });


    this.carregaDadosUser();
    this.carregaDadosUsers();
  }
  carregaDadosUser() {
    this.showSpinner = true;
    this.authservice.pegaMeusDados().subscribe(
      (res) => {
        if (res.user) {
          this.formulario.controls.id.setValue(this.authservice.usuario.id);
          this.formulario.controls.apelido.setValue(this.authservice.usuario.apelido);
          this.formulario.controls.nome.setValue(this.authservice.usuario.nomeempresa);
          this.formulario.controls.telefone.setValue(this.authservice.usuario.telefone);
          this.formulario.controls.email.setValue(this.authservice.usuario.email);
          this.formulario.controls.nomeempresa.setValue(this.authservice.usuario.nomeempresa);
          this.formulario.controls.cnpj.setValue(this.authservice.usuario.cnpj);
          this.formulario.controls.endereco.setValue(this.authservice.usuario.endereco);
          this.formulario.controls.cep.setValue(this.authservice.usuario.cep);
          this.formulario.controls.cidade.setValue(this.authservice.usuario.cidade);
          this.formulario.controls.estado.setValue(this.authservice.usuario.estado);
          this.formulario.controls.pais.setValue(this.authservice.usuario.pais);
          this.tipoconta = res.user.tipoconta;
        } else {
          this.modalService.showAlert('Erro no servidor', 'ERRO');
        }
        this.showSpinner = false;
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.modalService.showAlert('Erro Response', 'ERRO');
        this.showSpinner = false;
      }
    );

  }
  salvaNovoUsuario(){

    if (!this.validaForm()) {
      return;
    }
    this.formUser.controls.idParent.setValue(this.formulario.value.id);
    this.formUser.controls.tipoconta.setValue(this.tipoconta);
    this.formUser.controls.tipopessoa.setValue('fisica');
    console.log(this.formUser.value);

    this.showSpinner = true;
    this.usuariosService.cadastraUsuario(this.formUser.value).subscribe(res => {
     // console.log(res.detalhe);
      if(res.detalhe === 'usado'){
        this.modalService.showAlert(res.msg);
      }else{
        this.modalService.showSuccess('Cadastro realizado com sucesso!', 'Cadastro')
        .subscribe(() => window.location.reload());
      }
      this.showSpinner = false;
    });
  }

  bloquearUser(id){

    const result$ = this.modalService.showConfirm('Deseja realmente bloquear esse usuário?', 'Bloqueio');

    result$.asObservable()
      .pipe(
        take(1),
        switchMap(res => (res == false) || (res == null) ? EMPTY : this.usuariosService.bloquearUsuario(id))
      )
      .subscribe(res => {
       // console.log(res);
        if (res.detalhe === 'ok') {
          this.modalService.showSuccess('Usuário bloqueado!', 'Bloqueio')
          .subscribe(() => window.location.reload());
        } else {
          //window.location.reload();
        }
      },
        (errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;
          //window.location.reload();
        });



  }
  desbloquearUser(id){

    const result$ = this.modalService.showConfirm('Deseja realmente desbloquear esse usuário?', 'Desbloqueio');

    result$.asObservable()
      .pipe(
        take(1),
        switchMap(res => (res == false) || (res == null) ? EMPTY : this.usuariosService.desbloquearUsuario(id))
      )
      .subscribe(res => {
        console.log(res);
        if (res.detalhe === 'ok') {
          this.modalService.showSuccess('Usuário desbloqueado!', 'Desbloqueio')
          .subscribe(() => window.location.reload());
        } else {
          //window.location.reload();
        }
      },
        (errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;
          //window.location.reload();
        });



  }

  excluirUser(id){

    const result$ = this.modalService.showConfirm('Deseja realmente excluir esse usuário?', 'Exclusão');

    result$.asObservable()
    .pipe(
      take(1),
      switchMap(res => (res == false) || (res == null) ? EMPTY : this.usuariosService.excluirUsuario(id))
    )
    .subscribe(res => {
      console.log(res);
      if (res.detalhe === 'ok') {
        this.modalService.showSuccess('Usuário exluído!', 'Exclusão')
        .subscribe(() => window.location.reload());
      } else {
        //window.location.reload();
      }
    },
      (errorResponse: HttpErrorResponse) => {
        const error = errorResponse.error;
        this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
        this.showSpinner = false;
        //window.location.reload();
      });
  }

  carregaDadosUsers() {
    this.showSpinner = true;
    this.usuariosService.getUsers().subscribe((res) => {
      //console.log(res.users);
      this.listaUsers = [];
      if (res.users) {
          for(var i = 0; i< res.users.length; i++){
            this.listaUsers.push({
              nome: res.users[i].name,
              email: res.users[i].email,
              telefone: res.users[i].telefone,
              tipo: res.users[i].tipoconta,
              id: res.users[i].id,
              status: res.users[i].status
            })
          }

        } else {
          console.log('else');
        }
      this.showSpinner = false;
      console.log(this.listaUsers);
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.showSpinner = false;
      }
    );
  }

  validaForm(){

    const _email = this.formUser.controls.email;
    const _senha = this.formUser.controls.password;
    const _repetSenha = this.formUser.controls.confirmPassword;
    const _name = this.formUser.controls.name;
    const _telefone = this.formUser.controls.telefone;

    if (_name.invalid) {
      this.modalService.showAlert('Informe um nome válido!', 'Campo obrigatório');
      return false;
    } else if (_email.invalid) {
      this.modalService.showAlert('Informe um e-mail válido!', 'Campo obrigatório');
      return false;
    }else if (_senha.value === '') {
      this.modalService.showAlert('Informe uma senha válida.', 'Campo obrigatório');
      return false;
    } else if (_repetSenha.value != _senha.value) {
      this.modalService.showAlert('As senhas não são iguais.', 'Campo obrigatório');
      return false;
    }else if (_telefone.invalid) {
      this.modalService.showAlert('Informe um Telefone', 'Campo obrigatório');
      return false;
    } else if (_senha.invalid) {
      this.modalService.showAlert('A senha deve conter de 5 a 30 dígitos, no mínimo uma letra maiúscula um letra minúscula e um número.', 'Campo obrigatório');
      return false;
    }
    return true;
  }
  editarUser(index, idUserAtual){
    this.editaUser = true;
    this.formUser.controls.name.setValue(this.listaUsers[index].nome);
    this.formUser.controls.email.setValue(this.listaUsers[index].email);
    this.formUser.controls.telefone.setValue(this.listaUsers[index].telefone);
    this.formUser.controls.editarUser.setValue(true);
    this.formUser.controls.idUser.setValue(idUserAtual);
    this.formUser.controls.password.setValue(null);
    this.formUser.controls.confirmPassword.setValue(null);
  }
  showUser(id){
    console.log('show user');
  }
  limparVariaveis(){
    this.formUser.controls.editarUser.setValue(false);
    this.editaUser = false;
    this.formUser.reset();
  }
}
