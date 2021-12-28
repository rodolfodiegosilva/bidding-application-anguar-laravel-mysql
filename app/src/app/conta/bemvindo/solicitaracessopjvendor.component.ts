import { AuthService } from 'src/app/shared/auth.service';
import { BemvindoService } from './bemvindo.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/shared/form-validator';
import { MascaraUtil } from 'src/app/shared/mascaraUtil';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassModalService } from 'src/app/shared/modal/modal.service';

declare var jQuery: any;

@Component({
  selector: 'app-solicitaracessopjvendor',
  templateUrl: './solicitaracessopjvendor.component.html',
  styleUrls: ['./solicitaracessopjvendor.component.scss']
})
export class SolicitarAcessoPJVendorComponent implements OnInit {
  @ViewChild('alertaModal') alertaModal: ElementRef;

  escondeCategoria = true;

  files: any = [];

  listaCatCliente: any = [];
  //listaDocCliente = [];
  listcolor = ['#ff7e40', '#00a788', '#F00', '#fb00ff', '#660072', '#00b9d7', '#ffc107', '#007bff'];
  colorDoc = ['#ff7e40'];
  listarequest = [];
  listaEstados = [];
  listaMunicipios = [];
  estado: any;
  seguimento: any = [];
  tipoconta: string;
  palavra: string;


  showSpinner: boolean = false;
  strAlerta: string = '';

  step = 1;

  test: any;

  formulario: FormGroup;
  url: any;
  public masktelefone = MascaraUtil.mascTelefone;
  public maskcnpj = MascaraUtil.mascCnpj;
  public maskcep = MascaraUtil.mascCep;
  public termocheck: boolean;

  constructor(
    private formbuilder: FormBuilder,
    private authservice: AuthService,
    private bemvindoService: BemvindoService,
    private modalService: ClassModalService
  ) { }

  ngOnInit(): void {
    this.formulario = this.formbuilder.group({
      name: ["", Validators.required],
      apelido: ["", Validators.required],
      email: ["", Validators.email],
      telefone: ["", [Validators.required, Validators.pattern("^\\([1-9]{2}\\) [0-9]{0,1} [0-9]{4}-[0-9]{4}$")]],
      nomeempresa: ["", Validators.required],
      cnpj: ["", [Validators.required, FormValidator.cnpjValidator]],
      segmento: ["", [Validators.required]],
      endereco: ["", [Validators.required]],
      cep: ["", [Validators.required]],
      cidade: ["", [Validators.required]],
      estado: ["", [Validators.required]],
      pais: ["", [Validators.required]],
      validade: [""],
      buscategoria: [""],
      mudastatus: [false],
      lstFiles: [null],
      lstCategorias: [null]
    })


    this.carregaDadosUser();
    this.getEstados();
  }

  addtolist(el) {
    this.listaCatCliente.push(el);
    this.listarequest.splice(this.listarequest.indexOf(el), 1);
    this.formulario.controls["buscategoria"].setValue("");
  }

  removeFilter(event, item, id) {
    event.path[2].remove();
    this.listaCatCliente.splice(id, 1);
    if (item.valida) {
      this.listarequest.push(item);
    }
  }

  removeDoc(event, id) {
    event.path[2].remove();
    //this.listaDocCliente.splice(id, 1);
    this.files.splice(id, 1);
  }

  onKeydown(event) {
    const newCat = event.target.value;
    newCat.toUpperCase();
    for (var i = 0; i < this.listaCatCliente.length; i++) {
      const cat = this.listaCatCliente[i].nome;
      if (cat.toUpperCase() == newCat.toUpperCase()) {
        this.modalService.showAlert("Cotegorias com nomes iguais");
        return false;
      }
    }
    this.listaCatCliente.push({ id: 0, nome: event.target.value, valida: false, cor: this.listcolor[this.listaCatCliente.length] });
    event.target.value = "";
  }

  onChange2(estado) {
    this.estado = estado;
    this.getmunicipios();
    this.formulario.controls["estado"].setValue(estado);
  }
  onChange3(municipio) {
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

  getCategorias(palavra: string) {
    if (palavra == "") {
      this.listarequest = [];
      return;
    }

    this.bemvindoService.pegaCategoriasbylike(palavra).subscribe(res => {
      this.listarequest = [];
      for (var i = 0; i < res.lista.length; i++) {
        if (this.listaCatCliente.length == 0) {
          this.listarequest.push({
            id: res.lista[i].id,
            nome: res.lista[i].nome,
            valida: res.lista[i].valida,
            cor: this.listcolor[i]
          })
        } else if ((this.listaCatCliente.length == 1)
          && !(this.listaCatCliente[0].id == res.lista[i].id)) {
          this.listarequest.push({
            id: res.lista[i].id,
            nome: res.lista[i].nome,
            valida: res.lista[i].valida,
            cor: this.listcolor[i]
          })
        } else if ((this.listaCatCliente.length == 2)
          && !(this.listaCatCliente[1].id == res.lista[i].id)
          && !(this.listaCatCliente[0].id == res.lista[i].id)) {
          this.listarequest.push({
            id: res.lista[i].id,
            nome: res.lista[i].nome,
            valida: res.lista[i].valida,
            cor: this.listcolor[i]
          })
        }
      }
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.modalService.showAlert("Erro Response");
        this.listarequest = [];
        this.showSpinner = false;
      }
    );
  }

  carregaDadosUser() {
    this.showSpinner = true;
    this.bemvindoService.meuCadastro().subscribe(
      (res) => {
        if (res.user) {
          this.formulario.controls["apelido"].setValue(res.user.apelido);
          this.formulario.controls["name"].setValue(res.user.nomeempresa);
          this.formulario.controls["telefone"].setValue(res.user.telefone);
          this.formulario.controls["email"].setValue(res.user.email);
          this.formulario.controls["nomeempresa"].setValue(res.user.nomeempresa);
          this.formulario.controls["cnpj"].setValue(res.user.cnpj);
          this.formulario.controls["endereco"].setValue(res.user.endereco);
          this.formulario.controls["cep"].setValue(res.user.cep);
          this.formulario.controls["cidade"].setValue(res.user.cidade);
          this.formulario.controls["estado"].setValue(res.user.estado);
          this.formulario.controls["pais"].setValue(res.user.pais);
          // console.log(res);
          for (var i = 0; i < res.user.categorias.length; i++) {
            var element = res.user.categorias[i];
            this.addtolist(
              {
                id: element.pivot.categoria_id,
                nome: element.nome,
                valida: element.valida,
                cor: this.listcolor[i]
              }
            );
          }

          for (var i = 0; i < res.user.documentos.length; i++) {
            var element = res.user.documentos[i];
            // this.listaDocCliente.push(element.name);
            this.files.push({
              nome: element.name,
              namestore: element.namestore,
              base64: undefined,
            });
          }

          this.tipoconta = res.user.tipoconta;
        } else {
          this.modalService.showAlert("Erro no servidor");
        }
        this.showSpinner = false;
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.modalService.showAlert("Erro Response");
        this.showSpinner = false;
      }
    );

  }

  compactaImagem(objIMG) {
    var reader = new FileReader();
    reader.readAsDataURL(objIMG); // read file as data url

    const configIMG = {
      fileName: '',
      larguraMax: 0,
      alturaMax: 0,
      largura: 0,
      altura: 0
    }

    const maxTam = 200;
    var width: number;
    var height: number;
    const fileName = objIMG.name;
    document.getElementById('customFileLabel').innerHTML = fileName;

    reader.onload = (e) => { // called once readAsDataURL is completed
      const img = new Image();
      img.src = <string>e.target.result;
      console.log(e);
      img.onload = () => {
        if (img.width > img.height) {
          if (img.width > maxTam) {
            width = maxTam;
            height = img.height / img.width * width;
          }
        } else {
          if (img.height > maxTam) {
            height = maxTam;
            width = img.width / img.height * height;
          }
        }
        const elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, height);
        const image = ctx.canvas.toDataURL();
        return image;
      },
        reader.onerror = error => console.log(error);
    };

  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onChange(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    if (selectedFiles.length > 0) {
      this.getBase64(selectedFiles[0]).then(
        data => {
          this.files.push({
            nome: selectedFiles[0].name,
            namestore: 'undefined',
            base64: data
          });
        }
      );
      // this.listaDocCliente.push(selectedFiles[0].name);
    }
  }

  proximo(event: MouseEvent) {
    if (this.step == 1) {
      if (!this.validastep1()) {
        event.stopPropagation();
        return;
      }
    } else if (this.step == 2) {
      if (!this.validastep2()) {
        event.stopPropagation();
        return;
      }
    }
    this.step += 1;
  }
  anterior() {
    this.step -= 1;
  }
  ativaJanela(n) {

    if (n == 2) {
      if (!this.validastep1()) {
        this.step = 1;
        return;
      }
    } else if (n == 3) {
      if (!this.validastep1()) {
        this.step = 1;
        return;
      }
      if (!this.validastep2()) {
        this.step = 2;
        return;
      }
    }
    this.step = n;
  }

  onSubmit() {
    if (!this.validaTermos()) {
      return false;
    }
    this.showSpinner = true;
    const formData = new FormData();
    /*for (let i = 0; i < this.files.length; i++) {
      formData.append('arquivos_' + i, this.files[i], this.files[i].name);
    }*/
    formData.append('countfiles', this.files.length);
    for (let i = 0; i < this.listaCatCliente.length; i++) {
      formData.append('idcategoria_' + i, this.listaCatCliente[i].id);
      formData.append('nomecat_' + i, this.listaCatCliente[i].nome);
      formData.append('catvalida_' + i, this.listaCatCliente[i].valida);
    }
    formData.append('countcat', this.listaCatCliente.length);
    formData.append('apelido', this.formulario.value.apelido);
    formData.append('name', this.formulario.value.name);
    formData.append('telefone', this.formulario.value.telefone);
    formData.append('email', this.formulario.value.email);
    formData.append('nomeempresa', this.formulario.value.nomeempresa);
    formData.append('cnpj', this.formulario.value.cnpj);
    formData.append('endereco', this.formulario.value.endereco);
    formData.append('cep', this.formulario.value.cep);
    formData.append('cidade', this.formulario.value.cidade);
    formData.append('estado', this.formulario.value.estado);
    formData.append('pais', this.formulario.value.pais);
    formData.append('mudastatus', this.formulario.value.mudastatus);
    formData.append('segmento', this.formulario.value.segmento);
    formData.append('tipoconta', this.tipoconta);
    // formData.append('lstFiles', this.files);

    this.formulario.controls.lstFiles.setValue(this.files);
    this.formulario.controls.lstCategorias.setValue(this.listaCatCliente);

    this.bemvindoService.salvaContaPj(this.formulario.value).subscribe(res => {
      if (res.detalhe == "updateok") {
        this.authservice.atualizaUsuario(res.user);
      } else {
        console.log('updade erro!');
        return;
      }
      this.showSpinner = false;
    });

  }
  validastep1() {
    if (!this.formulario.controls.name.valid) {
      this.modalService.showAlert("Informe a Razão Social");
      return false;
    } else if (this.listaCatCliente.length < 1) {
      this.modalService.showAlert("Informe no mínimo uma categoria");
      return false;
    } else if (this.listaCatCliente.length > 3) {
      this.modalService.showAlert("Informe no máximo quatro categorias");
      return false;
    }

    return true;
  }

  validastep2() {
    if (!this.formulario.controls.nomeempresa.valid) {
      this.modalService.showAlert("Informe o nome da empresa.");
      return false;
    } else if (!this.formulario.controls.pais.valid) {
      this.modalService.showAlert("Informe o País.");
      return false;
    } else if (!this.formulario.controls.estado.valid) {
      this.modalService.showAlert("Informe um Estado.");
      return false;
    } else if (!this.formulario.controls.cidade.valid) {
      this.modalService.showAlert("Informe uma Cidade.");
      return false;
    } else if (!this.formulario.controls.estado.valid) {
      this.modalService.showAlert("Informe um Estado");
      return false;
    } else if (!this.formulario.controls.endereco.valid) {
      this.modalService.showAlert("Informe um Endereço");
      return false;
    } else if (!this.formulario.controls.cep.valid) {
      this.modalService.showAlert("Informe um CEP");
      return false;
    } else if (!this.formulario.controls.telefone.valid) {
      this.modalService.showAlert("Informe um Telefone");
      return false;
    } else if (this.files.length < 2) {
      this.modalService.showAlert("Obrigatório o envio dos documentos (Contrato Assinado, Doc. com foto e Procuração *se preciso)");
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

  loadDoc(filename: string) {
    this.showSpinner = true;
    this.bemvindoService.getMyDocument(filename).subscribe(
      (res: any) => {
        console.log(res);

        if (res.detalhe == "ok") {
          var title = document.createElement('title');
          title.textContent = res.doc.nome;

          var features = 'width=800, height=600, status=1, menubar=1, location=0, top=100';
          var winName = 'New_Window';
          var winRef = window.open('', winName, features);


          var obj: HTMLObjectElement = document.createElement('object');
          obj.style.width = '100%';
          obj.style.height = '100%';
          // get tipo
          try {
            obj.type = res.doc.split(';')[0].substring(5);
          } catch (error) {
          }

          obj.data = res.doc;

          winRef.document.head.appendChild(title);
          winRef.document.body.appendChild(obj);

        } else {
          this.modalService.showAlert("O arquivo esta corrompido. Reenvie o documento.");
        }
        this.showSpinner = false;

      });
  }

}
