import { ClassModalService } from './../../shared/modal/modal.service';
import { EMPTY, Subscriber } from 'rxjs';
import { NgModule, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { VendorAuthService } from '../vendor.auth.service';
import { AlertModalComponent } from '../../shared/modal/alert/alert-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';


declare var jQuery: any;

@Component({
  selector: 'app-classificados',
  templateUrl: './classificados.component.html',
  styleUrls: ['./classificados.component.css']
})
export class ClassificadosComponent implements OnInit {
  @ViewChild('alertaModal') alertaModal: ElementRef;

  constructor(
    private vendorAuthService: VendorAuthService,
    private formBuilder: FormBuilder,
    private modalService: ClassModalService
  ) { }

  campoVisible = [];
  cotacaoAberta = false;
  campoVisivel = false;
  files: any = [];
  strAlerta = '';
  showStrAlerta = false;
  itemEmEdicao: any;

  showSpinner = false;

  showShortDesciption = true;


  itemPropostaAtiva: any = null;
  propostaAtual = -1;
  listadePedidos = [];
  listadeProdutos = [];
  listaPropostas = [null];
  lista = ['Portugues'];

  ngOnInit(): void {

    this.importaPedidos();

  }

  enviarPropostaServico(event: MouseEvent, item) {
    if (!this.validaProServico(item)) {
      event.stopPropagation();
      return false;
    }

    var valor = item.valorservico;
    if (valor === '') {
      valor = 0;
    } else {
      valor = valor.replace('.', '');
      valor = valor.replace(',', '.');
      item.valorservico = parseFloat(valor);
    }
    item['arquivo'] = this.files;

    if (!item.proposta) {
      this.showSpinner = true;
      this.vendorAuthService.sendPropostaServico(item).subscribe(res => {
        console.log(res);
        if (res.detalhe === 'ok') {
          this.cotacaoAberta = false;
          this.importaPedidos();
          this.itemPropostaAtiva = null;
          this.modalService.showSuccess('Parabéns, sua Proposta foi enviada com sucesso.', 'Envio de Proposta');
        } else {
          this.modalService.showAlert('Erro no envio da Proposta.', 'ERRO');
        }
      },
        (errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;

        });
      this.showSpinner = false;

    } else {
      this.showSpinner = true;
      this.vendorAuthService.sendAtualizacaoProposta(this.listadeProdutos, item).subscribe(res => {
        if (res.detalhe === 'ok') {
          this.importaPedidos();
          this.itemPropostaAtiva = null;
          this.modalService.showSuccess('Proposta  alterada com sucesso.', 'ERRO');
        } else {
          this.modalService.showAlert('Erro no envio da Proposta.', 'ERRO');
        }
      },
        (errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;

        });
      this.showSpinner = false;
    }

  }

  addPropostaProd(event: MouseEvent, item) {
    // console.log(item.qtd);
    // console.log(item.valor);
    // console.log(item.dataentregaprod);
    if (!this.validaProProd(item)) {

      event.stopPropagation();

      return false;
    }

    item.valortotal = item.qtd * item.valorunitario;
    item.readonly = true;
    item.campoVisivel = true;
    // console.log(this.listadeProdutos);

  }

  editarProProd(item) {
    // console.log(item);
    item.campoVisivel = false;
    item.readonly = false;
  }

  enviarPropostaProduto(event: MouseEvent, item) {

    item['arquivo'] = this.files;
    if (!this.validaProposta(item)) {

      event.stopPropagation();

      return false;
    }
    if (!this.listadeProdutos['proposta']) {

      this.vendorAuthService.sendPropostaProduto(this.listadeProdutos, item).subscribe(res => {
        // console.log(res);
        if (res.detalhe === 'ok') {
          this.cotacaoAberta = false;
          this.itemPropostaAtiva = null;
          this.importaPedidos();
          this.modalService.showSuccess('Parabéns, sua proposta foi enviada com sucesso.', 'Envio de Proposta');
        } else {
          this.modalService.showAlert('Erro ao enviar proposta.');
        }
      },
        (errorResponse: HttpErrorResponse) => {

          // console.log(errorResponse.error);
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');

          this.showSpinner = false;

        });
    } else {

      this.vendorAuthService.sendAtualizacaoProposta(this.listadeProdutos, item).subscribe(res => {
        console.log(res);
        if (res.detalhe === 'ok') {
          this.importaPedidos();
          this.itemPropostaAtiva = null;
          this.modalService.showSuccess('Proposta editada alterada com sucesso.', 'Alteração de Proposta');
        } else {
          this.modalService.showAlert('Erro no envio da Proposta.', 'ERRO');
        }
      },
        (errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;

        });
    }
  }
  onChange(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    document.getElementById('customFileLabel').innerHTML = selectedFiles[0].name;

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
      console.log(this.files);
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

  importaPedidos() {

    this.showSpinner = true;
    this.vendorAuthService.getPedidoOrcamentos().subscribe(res => {
      console.log(res);

      if (res.lista && res.lista.length > 0) {
        this.listadePedidos = [];
        res.lista.forEach(row => {
          this.listadePedidos.push(
            {
              orcaid: row.id,
              titulo: row.titulo,
              tipo: row.orcamento,
              publicado: row.created_at,
              descricao: row.descricao,
              categorias: row.categorias,
              temvisita: row.temvisita,
              datainiciovisita: row.datainiciovisita,
              datafimvisita: row.datafimvisita,
              datainiciopublicacao: row.datainiciopublicacao,
              datafimpublicacao: row.datafimpublicacao,
              dataentregaestimada: row.datafimentrega,


              prazoentrega: 8,
              qtdPropostas: 2,
              temTabela: true,
              show: true,
              showProposta: false,
              showPropostaFeita: false,
              escondeeditar: null,
              status: row.proposta == null ? 'aberta' : 'propostaenviada',
              proposta: row.proposta

            }
          );
        });


      }
      //console.log(this.listadePedidos);
      /// console.log(this.listaPropostas);

      this.showSpinner = false;
    },
      (errorResponse: HttpErrorResponse) => {

        // console.log(errorResponse.error);
        const error = errorResponse.error;
        this.modalService.showAlert('Algum erro a tratar!', 'ERRO');

        this.showSpinner = false;

      });
  }

  escreverProposta(item) {

    /*if (this.cotacaoAberta){
      this.fecharProposta(this.itemEmEdicao);
      return;
    }

    this.limpaVariaveis(item);*/
    console.log(item);

    this.showSpinner = true;
    this.vendorAuthService.getProdutos(item.orcaid).subscribe(res => {
      console.log(res);
      if (res.detalhe === 'ok') {
        const lista = res.lista;
        this.itemPropostaAtiva = item;
        item.showProposta = item.showPropostaFeita == true ? false : true;
        this.listadeProdutos = lista;

        if (this.listadeProdutos && this.listadeProdutos.length > 0) {
          this.listadeProdutos.forEach(element => {
            element.valorunitario = element.valorunitario == null ? 0.00 : element.valorunitario;
            element.readonly = false;
            element.valortotal = element.valortotal == null ? 0.00 : element.valortotal;
            element.dataentrega = null;
            element.vampoVisivel = false;
          });
          this.listadeProdutos = lista;
        }
      }
     // console.log(this.listadeProdutos);
      console.log(item);


      this.showSpinner = false;
    },
    (errorResponse: HttpErrorResponse) => {

        // console.log(errorResponse.error);
        const error = errorResponse.error;
        this.modalService.showAlert('Algum erro a tratar!', 'ERRO');

        this.showSpinner = false;

    });

  }

  fecharProposta(item){

    // tslint:disable-next-line:no-conditional-assignment
    if (this.cotacaoAberta){
      const result$ = this.modalService.showConfirm('Você irá perder os campos preenchidos na cotação: ' + item.titulo + '. Certeza do cancelamento?', 'Confirmação');

      result$.asObservable()
      .pipe(
        take(1),
        // tslint:disable-next-line:max-line-length
        switchMap( async (res) => (res === null) || (res === false) ? EMPTY : this.limpaVariaveis(item)))
        .subscribe();
      return;
    }
    item.showProposta = false;
    item.showPropostaFeita = false;
    item.escondeeditar = false;
    this.itemPropostaAtiva = null;
    this.listadeProdutos = [];
  }
  varredura(event, item){
    this.itemEmEdicao = item;
    this.cotacaoAberta = true;
    console.log(event.target.value);
    console.log(item);
  }
  limpaVariaveis(item) {
      console.log('Limpar');
      this.cotacaoAberta = false;
      item.valorservico = null;
      item.dataentrega = null;
      item.descricaoproposta = null;
      this.files = [];

      item.showProposta = false;
      item.showPropostaFeita = false;
      item.escondeeditar = false;
      this.itemPropostaAtiva = null;
      this.listadeProdutos = [];
      return true;
   }

  editarProposta(item) {
    this.escreverProposta(item);
    item.showProposta = true;
    item.escondeeditar = true;
    // console.log(item);
  }
  excluirProposta(item) {
    // console.log(item);
    // this.mostraAlerta("Exculir sua Proposta?");
    this.showSpinner = true;
    this.vendorAuthService.excluirProposta(item.propoid).subscribe(res => {
      // console.log(res);
      if (res.detalhe === 'ok') {
        this.importaPedidos();
        this.modalService.showSuccess('Proposta excluída com sucesso!', 'Excluxão de Proposta');
      }
      this.showSpinner = false;
    },
      (errorResponse: HttpErrorResponse) => {
        // console.log(errorResponse.error);
        const error = errorResponse.error;
        this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
        this.showSpinner = false;

      });
  }

  visualizarProposta(item) {
    item.showPropostaFeita = true;
    this.escreverProposta(item);
  }

  onKeydown(event) {
    this.lista.push(event.target.value);
    event.target.value = '';
  }
  removeFilter(event) {
    event.path[2].remove();
    console.log(this.lista);
  }

  // valida dados de pedido de orcamento de serviço
  validaProServico(item) {

    if (!item.descricaoproposta) {
      this.modalService.showAlert('Descreva sua Proposta!', 'Campo obrigário');
      return false;
    } else if (!item.dataentrega) {
      this.modalService.showAlert('Informe uma Data para o Serviço!', 'Campo obrigário');
      return false;
    } else if (!item.valorservico) {
      this.modalService.showAlert('Informe um Valor para a Proposta!', 'Campo obrigário');
      return false;
    }
    return true;
  }

  validaProposta(item) {

    if (!item.descricaoproposta) {
      this.modalService.showAlert('Descreva sua Proposta!', 'Campo obrigário');
      return false;
    }
    return true;
  }

  validaProProd(item) {

    if (!item.valorunitario) {
      this.modalService.showAlert('informe o valor uniário !', 'Campo obrigário');
      return false;
    } else if (!item.dataentregaprod) {
      this.modalService.showAlert('Informe uma Data para entrega do produto!', 'Campo obrigário');
      return false;
    }
    return true;
  }

  getDocs(namestore, nameDocument) {

    console.log(namestore);
    console.log(nameDocument);

    this.showSpinner = true;
    this.vendorAuthService.getDocProposta(namestore).subscribe(
      (res: any) => {
        if (res.detalhe === 'ok') {
          var title = document.createElement('title');
          title.textContent = nameDocument;

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
          this.modalService.showAlert(res.detalhe);
          return;
        }
        this.showSpinner = false;
      });
  }

  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
  }
}
