import { FormValidator } from './../../shared/form-validator';
import { MascUtil } from './../../shared/mascaraUtil';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CadastroService } from './acadastro.service';
import { ClassModalService } from 'src/app/shared/modal/modal.service';
import { CustomValidators } from 'src/app/shared/customvalidators/custom-validators';


declare const previousFunc: any;
declare const nextFunc: any;

declare var jQuery: any;

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: [
    './cadastrar.component.css',
    './component-custom-switch.css'

  ]
})
export class CadastrarComponent implements OnInit {

  @ViewChild('mensagemModal') mensagemModal: ElementRef;

  showSpinner: boolean = false;

  emailvalido = true;
  senhaiguais = true;
  quantcaracteres = true;
  minnumero = true;
  letramaius = true;
  letraminus = true;

  pj: any;
  pf: any;

  //  eCliente: boolean = false;
  //  eFornecedor: boolean = false;

  myFormulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private minhaApiservico: CadastroService,
    private modalService: ClassModalService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public frmSignup: FormGroup;

  maskcnpj = MascUtil.cnpj.mask;
  ngOnInit(): void {

    this.myFormulario = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      //senha: ["", [Validators.required,Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,30}')]],
      //repetSenha: ["", Validators.required],
      password: [null, Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        Validators.minLength(5)])
      ],
      confirmPassword: [null, Validators.compose([Validators.required])],
      empresa: [""],
      cnpj: ["", [Validators.required, FormValidator.cnpjValidator]],
      name: [""],
      cpf: ["", Validators.required]
    },
      {
        validator: CustomValidators.passwordMatchValidator
      });
  }

  validaTipocadastro() {
    const consumidorvar: any = document.getElementById('swcons');
    const fornecedorvar: any = document.getElementById('swforn');

    const fpvar: any = document.getElementById('swpf');
    const fjvar: any = document.getElementById('swpj');


    if ((consumidorvar.checked == fornecedorvar.checked) || fpvar.checked == fjvar.checked) {
      return false;
    }
    if (fornecedorvar.checked && fpvar.checked) {
      return false;
    }
    return true;
  }


  onSubmit() {

    this.pf = document.getElementById('swpf');
    this.pj = document.getElementById('swpj');

    if (this.pj.checked) {
      if (!this.myFormulario.controls["cnpj"].valid) {
        this.modalService.showAlert("O CNPJ não é válido!");
        return;
      }
    } else if (this.pf.checked) {
      if (!this.myFormulario.controls["cpf"].valid) {
        this.modalService.showAlert("Informe o CPF!");
        return;
      }
    }

    if (!this.validaTipocadastro()) {
      this.modalService.showAlert("Conflito de dados.");
      return;
    }

    const oCadastro = {
      email: this.myFormulario.controls.email.value,
      password: this.myFormulario.controls.password.value,
      tipoconta: "",
      tipopessoa: "",
      nomeempresa: this.myFormulario.controls.empresa.value,
      cnpj: this.myFormulario.controls.cnpj.value,
      name: this.myFormulario.controls.name.value,
      cpf: this.myFormulario.controls.cpf.value,
    };

    const myclientvar: any = document.getElementById('swcons');
    const myfornecedorvar: any = document.getElementById('swforn');
    if (myclientvar.checked) {
      oCadastro.tipoconta = "client";
    } else if (myfornecedorvar.checked) {
      oCadastro.tipoconta = "vendor";
    } else {
      this.modalService.showAlert("Informa um tipo de conta válida!");
      return;
    }

    const pfvar: any = document.getElementById('swpf');
    const pjvar: any = document.getElementById('swpj');

    if (pfvar.checked) {
      oCadastro.tipopessoa = "fisica";
    } else if (pjvar.checked) {
      oCadastro.tipopessoa = "juridica";
    } else {
      this.modalService.showAlert("Informa um tipo de conta válida!");
      return;
    }

    this.showSpinner = true;
    this.minhaApiservico.getCadastra(oCadastro).subscribe(res => {
      if (res.detalhe == 'usado') {
        this.modalService.showAlert(res.msg);
      } else if (res.detalhe == 'ok') {
        this.modalService.showSuccess("Parabéns, seu cadastro foi criado com sucesso.Verifique a caixa de entrada ou o spam do seu e-mail.Em alguns instantes enviaremos um link para validação do seu cadastro.", "Cadastro realizado");
        this.router.navigate(["acessar"]);
      } else {
        this.modalService.showAlert(res.detalhe);
      }
      this.showSpinner = false;
    });

  }

  goTodados(x: HTMLInputElement) {
    if (!this.validaTipocadastro()) {
      this.modalService.showAlert("Conflito de dados.");
      return;
    }

    nextFunc(x);
  }

  goEnd(x: HTMLInputElement) {
    const _email = this.myFormulario.controls["email"];
    const _senha = this.myFormulario.controls["password"];
    const _repetSenha = this.myFormulario.controls["confirmPassword"];

    if (_email.invalid) {
      this.modalService.showAlert("O e-mail é Inválido!");
      return;
    } else if (_senha.value == "") {
      this.modalService.showAlert("Informe uma senha válida.");
      return;
    } else if (_repetSenha.value != _senha.value) {
      this.modalService.showAlert("As senhas não são iguais.");
      return;
    } else if (_senha.invalid) {
      this.modalService.showAlert("A senha deve conter de 5 a 30 dígitos, no mínimo uma letra maiúscula um letra minúscula e um número.");
      return;
    }

    this.showSpinner = true;
    this.minhaApiservico.existeEmail(_email.value).subscribe(res => {
      if (res.detalhe == "livre") {
        nextFunc(x);
      } else {
        this.modalService.showAlert("O e-mail já existe!");
      }
      this.showSpinner = false;
    });
  }

  previousfunc(event, x: any) {
    previousFunc(x);
    event.preventDefault();
    return false;
  }

  marcatipo(ev) {
    const e = ev.target;
    if (!e.checked) {
      return false;
    }
    var outroBotao: any;
    if (e.id == 'swcons') {
      outroBotao = document.getElementById('swforn');
    } else {
      outroBotao = document.getElementById('swcons');

      const fp: any = document.getElementById('swpf');
      const fj: any = document.getElementById('swpj');
      fp.checked = false;
      fj.checked = true;
    }

    outroBotao.checked = false;
  }

  marcapessoafisica(ev) {
    const e = ev.target;
    const myfornecedorvar: any = document.getElementById('swforn');
    if (!e.checked || myfornecedorvar.checked) {
      return false;
    }
    var outroBotao: any = (e.id == 'swpj') ? document.getElementById('swpf') : document.getElementById('swpj');
    outroBotao.checked = false;
  }


  sair() {
    this.router.navigate(["acessar"]);
  }



}
