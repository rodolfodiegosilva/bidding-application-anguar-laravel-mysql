import { ClientService } from './../../client/client.service';
import { ClassModalService } from 'src/app/shared/modal/modal.service';
import { MascUtil } from './../../shared/mascaraUtil';
import { AuthService } from 'src/app/shared/auth.service';
import { BemvindoService } from './bemvindo.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/shared/form-validator';
import { MascaraUtil } from 'src/app/shared/mascaraUtil';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/shared/models/solicitacao.model';

declare var jQuery: any;

@Component({
  selector: 'app-solicitaracessopfclient',
  templateUrl: './solicitaracessopfclient.component.html',
  styleUrls: ['./solicitaracessopfclient.component.scss']
})
export class SolicitarAcessoPFClientComponent implements OnInit {
  @ViewChild('alertaModal') alertaModal: ElementRef;

  showSpinner = false;
  listaMunicipios = [];
  listaEstados = [];
  estado: any;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  step = 1;
  tipoconta: any;

  formulario: FormGroup;

  public masktelefone = MascUtil.telefone.mask;
  public maskcpf = MascUtil.cpf.mask;
  public maskcep = MascaraUtil.mascCep;
  public termocheck: boolean;

  constructor(
    private formbuilder: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private bemvindoService: BemvindoService,
    private clientService: ClientService,
    private modalService: ClassModalService
  ) { }
  url: any;
  imgProfile:any = [];
  camerawhite ="./assets/camera-white.jpg";

  ngOnInit(): void {
    this.url ="./assets/improfile.jpg";
    this.formulario = this.formbuilder.group({
      //     id: [1],
      name: ["", Validators.required],
      apelido: ["", Validators.required],
      email: ["", Validators.email],
      telefone: ["", [Validators.required, Validators.pattern(MascUtil.telefone.valid)]],
      cpf: ["", [Validators.required, Validators.pattern(MascUtil.cpf.valid)]],
      endereco: ["", Validators.required],
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      estado: ["", Validators.required],
      pais: ["", Validators.required],
      bairro: ["", Validators.required],
      complemento: [""],
      validade: [""],
      foto: [null],
      mudastatus: [false],
      imgProfile:[""]
    })

    this.carregaDadosUser();
    this.getEstados();
  }

  onChange2(estado){
    this.estado = estado;
    this.getmunicipios();
    this.formulario.controls["estado"].setValue(estado);
  }
  onChange3(municipio){
    this.formulario.controls["cidade"].setValue(municipio);
  }

  getEstados() {
    this.bemvindoService.pegaEstados().subscribe(res => {
      this.listaEstados = [];
      for (var i = 0; i < res.lista.length; i++) {
        this.listaEstados.push({
          id: res.lista[i].id,
          codigouf: res.lista[i].CodigoUf,
          nome: res.lista[i].Nome,
          uf: res.lista[i].Uf,
          regiao: res.lista[i].Regiao
        })
      }
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);

        this.listaEstados = [];
        this.showSpinner = false;
      }
    );
  }

  getmunicipios() {
    this.bemvindoService.pegaMunicipios(this.estado).subscribe(res => {
      this.listaMunicipios = [];
      for (var i = 0; i < res.lista.length; i++) {
        this.listaMunicipios.push({
          id: res.lista[i].id,
          codigouf: res.lista[i].CodigoUf,
          nome: res.lista[i].Nome,
          uf: res.lista[i].Uf,
          regiao: res.lista[i].Regiao
        })
      }
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);

        this.listaMunicipios = [];
        this.showSpinner = false;
      }
    );
  }

  carregaDadosUser() {
    this.showSpinner = true;
    this.authservice.pegaProfile().subscribe(
      (res) => {
        if (res.user) {
          this.formulario.controls["apelido"].setValue(this.authservice.usuario.apelido);
          this.formulario.controls["name"].setValue(this.authservice.usuario.name);
          this.formulario.controls["telefone"].setValue(this.authservice.usuario.telefone);
          this.formulario.controls["email"].setValue(this.authservice.usuario.email);
          this.formulario.controls["cpf"].setValue(this.authservice.usuario.cpf);
          this.formulario.controls["endereco"].setValue(this.authservice.usuario.endereco);
          this.formulario.controls["cep"].setValue(this.authservice.usuario.cep);
          this.formulario.controls["cidade"].setValue(this.authservice.usuario.cidade);
          this.formulario.controls["estado"].setValue(this.authservice.usuario.estado);
          this.formulario.controls["pais"].setValue(this.authservice.usuario.pais);
          this.formulario.controls["bairro"].setValue(this.authservice.usuario.bairro);
          this.formulario.controls["complemento"].setValue(this.authservice.usuario.complemento);
          this.formulario.controls["foto"].setValue('null');
          this.tipoconta = res.user.tipoconta;

          if (res.user.foto != 'null') {
            this.url = res.user.foto;
          }
        } else {
          alert("Erro no servidor");
        }
        this.showSpinner = false;
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.showSpinner = false;
      }
    );

  }

  onTrocaImg(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    if (selectedFiles.length > 0) {
      this.getBase64(selectedFiles[0]).then(
        data => {
          this.formulario.controls.foto.setValue(data);
          this.url = data;
        }
      );
      // this.listaDocCliente.push(selectedFiles[0].name);
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


  proximo() {
    if (this.step == 2) {
      if (!this.validastep1()) {
        return;
      }
    } else if (this.step == 1) {
      if (!this.validastep2()) {
        return;
      }
    }
    this.step += 1;
  }
  validastep1() {
    if (!this.formulario.controls.apelido.valid) {
      this.modalService.showAlert("Informe um apelido válido!.");
      return false;
    }
    return true;
  }
  validastep2() {
    if (!this.formulario.controls.name.valid) {
      this.modalService.showAlert("Informe seu nome.");
      return false;
    }
    if (!this.formulario.controls.cpf.valid) {
      this.modalService.showAlert("Informe seu cpf.");
      return false;
    }
    if (!this.formulario.controls.pais.valid) {
      this.modalService.showAlert("Informe um Pais.");
      return false;
    }
    if (!this.formulario.controls.estado.valid) {
      this.modalService.showAlert("Informe um estado.");
      return false;
    }
    if (!this.formulario.controls.cidade.valid) {
      this.modalService.showAlert("Informe uma cidade.");
      return false;
    }
    if (!this.formulario.controls.cep.valid) {
      this.modalService.showAlert("Informe o cep.");
      return false;
    }
    if (!this.formulario.controls.endereco.valid) {
      this.modalService.showAlert("Informe o endereço.");
      return false;
    }
    if (!this.formulario.controls.telefone.valid) {
      this.modalService.showAlert("Informe seu telefone.");
      return false;
    }
    if (!this.formulario.controls.bairro.valid) {
      this.modalService.showAlert("Informe o bairro");
      return false;
    }
    return true;
  }

  validaTermos() {
    const objConcorda: any = document.getElementById('termocheck');
    if (!objConcorda.checked) {
      this.modalService.showAlert("A aceitação dos termos é requerida para o uso da ferramenta.");
      return false;
    }
    return true;
  }
  anterior() {
    this.step -= 1;
  }
  ativaJanela(n) {
    this.step = n;
  }

  onSubmit() {
    if (!this.validaTermos()) {
      return false;
    }

    this.formulario.controls.mudastatus.setValue(true);
    this.formulario.controls.imgProfile.setValue(this.imgProfile);

    this.showSpinner = true;


    console.log(this.imgProfile);
    //return;
    this.bemvindoService.salvaContaPF(this.formulario.value).subscribe(res => {
      console.log(res);
      if (res.detalhe == "updateok") {
        this.authservice.atualizaUsuario(res.user);
        this.authservice.redirecionaParaZona();
      } else {
        console.log('updade erro!');
        return;
      }
      this.showSpinner = false;
    });

  }

  sair() { }


}
