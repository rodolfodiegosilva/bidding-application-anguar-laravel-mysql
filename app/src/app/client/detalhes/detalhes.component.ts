import { ClientService } from './../client.service';
import {  ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClassModalService } from 'src/app/shared/modal/modal.service';
import { switchMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

declare var jQuery: any;

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;

  private id: string;
  showSpinner: boolean = false;
  listaProRecebida: any = [];

  cotacao: any;
  categorias: any = [];
  propostasprod: any = [];
  proposta: any;
  docproposta: any;
  namestore: any;
  showProposta = false;
  descricaoproposta: string;
  showShortDesciption = true;

  formCotacao: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ClassModalService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.orcamentoRecebido();

    this.formCotacao = this.formBuilder.group({
      fornecedor : [''],
      email : [''],
      telefone : [''],
      pais : [''],
      estado : [''],
      cidade : [''],
      descricaoproposta : [''],
      dataentrega : [''],
      valorservico : [''],
      orcamento : [''],
    });
  }
  orcamentoRecebido() {
    //console.log(item);
    this.showSpinner = true;
    this.clientService.getMyOrcamentoRecebido(this.id).subscribe(res => {
      //console.log(res.lista);
      if (res.lista) {
        this.cotacao = res.cotacao;
        this.categorias = res.cotacao.categorias;
        //this.propostaprod = res.lista.propostaprod;

        res.lista.forEach(row => {
          this.listaProRecebida.push(
            {
              id: row.id,
              dataentrega: row.dataentrega,
              proposta: row.proposta,
              nomeempresa: row.nomeempresa,
              docproposta: row.docproposta,
              fornecedor: row.fornecedor,
              propostasprod: row.propostasprod,
              // tslint:disable-next-line:max-line-length
              valorservico: row.valorservico == null ? null : row.valorservico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }
          );
        });
      }
      console.log(this.listaProRecebida);

      this.showSpinner = false;
    });
  }

  suspenderCotacao(){

    const result$ = this.modalService.showConfirm('Certeza na suspenção da Cotação?');
    result$.asObservable()
      .pipe(
        take(1),
        // tslint:disable-next-line:max-line-length
        switchMap(res => (res == null) || (res == false) ? EMPTY : this.clientService.suspenderCotacao(this.cotacao.id))
      )
      .subscribe(res => {
        // console.log(res)
        if (res.detalhe === 'ok') {
          this.modalService.showSuccess('Cotação suspensa com sucesso', 'Suspenção de contação')
        .subscribe(() => window.location.reload());
        } else {
          this.modalService.showAlert('Erro em suspender Cotação', 'ERRO')
            .subscribe(() => window.location.reload());
        }
      },
        (errorResponse: HttpErrorResponse) => {
          // console.log(errorResponse.error);
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;
        });

  }

  reabrirCotacao(){

    const result$ = this.modalService.showConfirmDate('Certeza da reativação da Cotação?', 'Reativação de Cotação');
    result$.asObservable()
      .pipe(
        take(1),
        // tslint:disable-next-line:max-line-length
        switchMap(response => (response['value'] == null) || (response['value'] == false) ? EMPTY : this.clientService.reabrirCotacao(this.cotacao.id, response))
      )
      .subscribe(res => {
        // console.log(res)
        if (res.detalhe === 'ok') {
          this.modalService.showSuccess('Cotação reaberta com sucesso', 'Reativação de Contação')
        .subscribe(() => window.location.reload());
        } else {
          this.modalService.showAlert('Erro em reativar Cotação', 'ERRO')
            .subscribe(() => window.location.reload());
        }
      },
        (errorResponse: HttpErrorResponse) => {
          // console.log(errorResponse.error);
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
          this.showSpinner = false;
        });
  }

  visualizarProposta(item){
    console.log(this.listaProRecebida[item]);

    this.formCotacao.controls.fornecedor.setValue(this.listaProRecebida[item].nomeempresa);
    this.formCotacao.controls.email.setValue(this.listaProRecebida[item].fornecedor.email);
    this.formCotacao.controls.telefone.setValue(this.listaProRecebida[item].fornecedor.telefone);
    this.formCotacao.controls.pais.setValue(this.listaProRecebida[item].fornecedor.pais);
    this.formCotacao.controls.estado.setValue(this.listaProRecebida[item].fornecedor.estado);
    this.formCotacao.controls.cidade.setValue(this.listaProRecebida[item].fornecedor.cidade);
    this.formCotacao.controls.dataentrega.setValue(this.listaProRecebida[item].dataentrega);
    this.formCotacao.controls.valorservico.setValue(this.listaProRecebida[item].valorservico);
    this.formCotacao.controls.valorservico.setValue(this.listaProRecebida[item].valorservico);
    this.formCotacao.controls.descricaoproposta.setValue(this.listaProRecebida[item].proposta);
    this.descricaoproposta = this.listaProRecebida[item].proposta;
    this.docproposta = this.listaProRecebida[item].docproposta.name;
    this.namestore = this.listaProRecebida[item].docproposta.namestore;
    this.propostasprod = this.listaProRecebida[item].propostasprod;


    jQuery(this.formModal.nativeElement).modal('show');

    console.log(this.propostasprod);
   // console.log(this.namestore);


    //this.showSpinner = true;
   /*this.clientService.getProposta(item.id).subscribe(res => {
      console.log(res);
      if (res.proposta) {
          this.proposta = res.proposta;
        //this.propostaprod = res.proposta.propostaprod;
          this.showProposta = true;
      }
      this.showSpinner = false;
      console.log(this.proposta);
    });*/


  }

  fecharProposta(){
    console.log('aqui');
    this.showProposta = false;
  }

  getDocs() {

    this.showSpinner = true;
    this.clientService.getDocProposta(this.namestore).subscribe(
    (res: any) => {
      if (res.detalhe == 'ok') {
        var title = document.createElement('title');
        title.textContent =  this.docproposta;

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
