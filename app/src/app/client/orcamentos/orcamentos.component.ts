import { ClassModalService } from './../../shared/modal/modal.service';
import { ClientService } from './../client.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClassOrcamento, ListadeProdutos } from '../../shared/models/user-model';
import { EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { take, switchMap } from 'rxjs/operators';

declare var jQuery: any;

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.css']
})
export class OrcamentosComponent implements OnInit {

  modalControl: string;

  showSpinner = false;
  @ViewChild('mensagemModal') mensagemModal: ElementRef;
  @ViewChild('modalAddItem') modalAddItem: ElementRef;
  @ViewChild('encerrarModal') encerrarModal: ElementRef;

  formCotaServico: FormGroup;
  formCotaProduto: FormGroup;
  formProdutos: FormGroup;
  formServico: FormGroup;

  myOrcamento: ClassOrcamento;

  listaProdutos: Array<ListadeProdutos> = [];

  listadePedidos = [];
  listaProRecebida = [];
  imgProd: any;
  listaCatOrcamento = [];
  lista = [];
  listcolor = ['#ff7e40', '#00a788', '#F00', '#fb00ff', '#660072', '#00b9d7', '#ffc107', '#007bff'];
  listarequest = [];

  editaProduto = false;
  idProd: any;

  msgEncerramento: any;
  cotaPraEncerrar: any;

  showShortDesciption = true;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private modalService: ClassModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formCotaServico = this.formBuilder.group({
      titulo: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      temvisita: [null],
      categorias: [null, [Validators.required]],
      datainiciopublicacao: [null, [Validators.required]],
      datafimpublicacao: [null, [Validators.required]],
      datafimentrega: [null, [Validators.required]]
    });
    this.formCotaProduto = this.formBuilder.group({
      titulo: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      temvisitaprod: [null],
      categorias: [null, [Validators.required]],
      datainiciopublicacao: [null, [Validators.required]],
      datafimpublicacao: [null, [Validators.required]],
      datafimentrega: [null, [Validators.required]]
    });

    this.formProdutos = this.formBuilder.group({
      mpartnumber: [null],
      mncm: [null],
      mdescricao: [null, Validators.required],
      mfabricante: [null, Validators.required],
      mqtd: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
      mimagem: [null]
    });
    this.importaPedidos();

    this.formServico = this.formBuilder.group({
      titulo: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      subcategoria: [null, [Validators.required]]
    });

  }
  removeFilter(event, item, id) {
    event.path[2].remove();
    this.listaCatOrcamento.splice(id, 1);
    this.listarequest.push(item);
  }
  onKeydown(event) {
    const newCat = event.target.value;
    newCat.toUpperCase();
    for (var i = 0; i < this.listaCatOrcamento.length; i++) {
      const cat = this.listaCatOrcamento[i].nome;
      if (cat.toUpperCase() == newCat.toUpperCase()) {
        this.modalService.showAlert('Cotegorias com nomes iguais', 'Conflito');
        return false;
      }
    }
    this.listaCatOrcamento.push({ id: 0, nome: event.target.value, valida: false, cor: this.listcolor[this.listaCatOrcamento.length] });
    event.target.value = '';
  }

  addtolist(el) {
    this.listaCatOrcamento.push(el);
    this.listarequest.splice(this.listarequest.indexOf(el), 1);
  }

  getPedido(myid) {
    for (var i = 0; i < this.listadePedidos.length; i++) {
      if (this.listadePedidos[i].id == myid) {
        return this.listadePedidos[i];
      }
    }
    return null;
  }
  modaldeencerramento(item) {
    this.cotaPraEncerrar = item;
    jQuery(this.encerrarModal.nativeElement).modal('show');
  }
  encerrarCotacao() {
    console.log(this.cotaPraEncerrar);
    console.log(this.msgEncerramento);

    this.showSpinner = true;
    this.clientService.encerrarCotacao(this.cotaPraEncerrar, this.msgEncerramento).subscribe(res => {
      console.log(res);
      if (res.detalhe === 'ok') {
        this.modalService.showSuccess('A cotação foi encerrada com sucesso!', 'Cotação encerrada')
          .subscribe(() => window.location.reload());
      } else {
        this.modalService.showAlert('Erro no envio da cotação.', 'ERRO')
          .subscribe(() => window.location.reload());
      }
      this.showSpinner = false;
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.showSpinner = false;
      }
    );
  }

  getCategorias(palavra: string) {
    if (palavra === '') {
      this.listarequest = [];
      return;
    }
    this.clientService.pegaCategoriasbylike(palavra).subscribe(res => {
      this.listarequest = [];
      for (var i = 1; i < res.lista.length; i++) {
        this.listarequest.push({
          id: res.lista[i].id,
          nome: res.lista[i].nome,
          valida: true,
          cor: this.listcolor[i]
        })
      }
      //  this.showSpinner = false;
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);

        this.listarequest = [];
        this.showSpinner = false;
      }
    );
  }

  importaPedidos() {
    this.showSpinner = true;
    this.clientService.getMyPedidoOrcamentos().subscribe(res => {
      //console.log(res);
      if (res.listapedidos && res.listapedidos.length > 0) {
        this.listadePedidos = [];
        res.listapedidos.forEach(row => {
          this.listadePedidos.push(
            {
              id: row.id,
              titulo: row.titulo,
              tipo: row.orcamento,
              publicado: row.created_at,
              entrega: row.created_at,
              descricao: row.descricao,
              categorias: row.categorias,
              datainiciopublicacao: row.datainiciopublicacao,
              datafimpublicacao: row.datafimpublicacao,
              datainicioentrega: row.datainicioentrega,
              datafimentrega: row.datafimentrega,
              status: row.status,
              qtdPropostas: 2,
              temTabela: true,
              show: true
            }
          );
        });
      }
      this.showSpinner = false;
      console.log(this.listadePedidos);
    });
  }

  salvarServico() {
    if (!this.validaServico()) {
      return false;
    }

    const result$ = this.modalService.showConfirmDate('Seu serviço precisa de visita?', 'Visita para o Serviço');

    result$.asObservable()
          .pipe(
            take(1),
            // tslint:disable-next-line:max-line-length
            switchMap(res => res['value'] == null ? EMPTY : this.clientService.sendPedidoServico(this.formCotaServico.value, this.listaCatOrcamento, res))
          )
          .subscribe(res => {
           // console.log(res);
            if (res.detalhe === 'ok') {
              this.modalService.showSuccess('Parabéns, sua cotação foi enviada com sucesso.', 'Cotação Enviada')
              .subscribe(() => window.location.reload());
            } else {
            }
          },
            (errorResponse: HttpErrorResponse) => {
              const error = errorResponse.error;
              this.modalService.showAlert('Algum erro a tratar!', 'ERRO');
              this.showSpinner = false;
            });

  }
  editarProd(item) {

    this.editaProduto = true;
    this.idProd = item;
    this.formProdutos.controls['mpartnumber'].setValue(this.listaProdutos[item]['mpartnumber']);
    this.formProdutos.controls['mncm'].setValue(this.listaProdutos[item]['mncm']);
    this.formProdutos.controls['mdescricao'].setValue(this.listaProdutos[item]['mdescricao']);
    this.formProdutos.controls['mfabricante'].setValue(this.listaProdutos[item]['mfabricante']);
    this.formProdutos.controls['mqtd'].setValue(this.listaProdutos[item]['mqtd']);
    this.formProdutos.controls['mimagem'].setValue(this.listaProdutos[item]['mimagem']);
    this.imgProd = this.listaProdutos[item]['mimagem'];
  }
  excluirProd(item) {
    this.listaProdutos.splice(item, 1);
    console.log(this.listaProdutos);

  }
  addProd(event: MouseEvent) {

    if (!this.validaProduto()) {
      event.stopPropagation();
      return;
    }
    if (this.editaProduto) {
      this.listaProdutos.splice(this.idProd, 1);
      this.formProdutos.controls['mimagem'].setValue(this.imgProd);
      this.listaProdutos.push(this.formProdutos.value);
      this.editaProduto = false;
    } else {
      this.formProdutos.controls['mimagem'].setValue(this.imgProd);
      this.listaProdutos.push(this.formProdutos.value);
    }
    console.log(this.listaProdutos);
    this.imgProd = null;
    this.limparLista();
    jQuery(this.modalAddItem.nativeElement).modal('hide');
  }

  salvarProduto() {
    if (!this.validaCotaProduto()) {
      return false;
    }

    const result$ = this.modalService.showConfirm('Seu orçamento precisa de visita?');
    result$.asObservable()
      .pipe(
        take(1),
        // tslint:disable-next-line:max-line-length
        switchMap(res => res == null ? EMPTY : this.clientService.sendPedidoProduto(this.formCotaProduto.value, this.listaProdutos, this.listaCatOrcamento, res))
      )
      .subscribe(res => {
        // console.log(res)
        if (res.detalhe === 'ok') {
          this.modalService.showSuccess('Parabéns, sua cotação foi enviada com sucesso.', 'Cotação Enviada')
            .subscribe(() => window.location.reload());
        } else {
          this.modalService.showAlert('Erro no envio da cotação.')
            .subscribe(() => window.location.reload());
        }
      },
        (errorResponse: HttpErrorResponse) => {
          // console.log(errorResponse.error);
          const error = errorResponse.error;
          this.modalService.showAlert('Algum erro a tratar!');
          this.showSpinner = false;
        });

  }

  orcamentoRecebido(item) {
    //console.log(item);
    this.showSpinner = true;
    this.clientService.getMyOrcamentoRecebido(item.id).subscribe(res => {
      console.log(res);
      if (res.lista && res.lista.length > 0) {
        this.listaProRecebida = [];

        res.lista.forEach(row => {
          this.listaProRecebida.push(
            {
              id: row.id,
              dataentrega: row.dataentrega,
              proposta: row.proposta,
              empresa: row.nomeempresa,
              docproposta: row.docproposta,
              idcotacao: item.id,
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
  getDocs(namestore, nameDocument) {

    console.log(namestore);
    console.log(nameDocument);

    this.showSpinner = true;
    this.clientService.getDocProposta(namestore).subscribe(
    (res: any) => {
      if (res.detalhe == 'ok') {
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
  delImg(){
    this.imgProd = null;
  }
  onTrocaImg(event) {
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    const selectedFiles = <FileList>event.srcElement.files;
    if (selectedFiles.length > 0) {
      this.getBase64(selectedFiles[0]).then(
        data => {
          this.formProdutos.controls['mimagem'].setValue(data);
          this.imgProd = data;
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
  // seleciona imagem
  onChange(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data imgProd

      const maxTam = 200;
      var width: number;
      var height: number;
      const fileName = event.target.files[0].name;
      document.getElementById('customFileLabel').innerHTML = fileName;

      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = new Image();
        img.src = <string>e.target.result;

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
          // console.log(img.width);
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          const image = ctx.canvas.toDataURL();
          // console.log(image);
          this.imgProd = image;
        },
          reader.onerror = error => console.log(error);
      };

    }

    // const selectedFiles = <FileList>event.srcElement.files;

  }

  validaCotaProduto() {

    if (!this.formCotaProduto.controls.titulo.valid) {
      this.modalService.showAlert('Informe um Título.');
      return false;
    } else if (!this.formCotaProduto.controls.descricao.valid) {
      this.modalService.showAlert('Informe uma Descrição.');
      return false;
    } else if (!this.formCotaProduto.controls.datainiciopublicacao.valid) {
      this.modalService.showAlert('Informe a data do inicio da publicação');
      return false;
    } else if (!this.formCotaProduto.controls.datafimpublicacao.valid) {
      this.modalService.showAlert('Informe a data do fim da publicação');
      return false;
    } else if (!this.formCotaProduto.controls.datafimentrega.valid) {
      this.modalService.showAlert('Informe a data termino esperada');
      return false;
    } else if (this.listaProdutos.length < 1) {
      this.modalService.showAlert('Insira um ou mais produtos!');
      return false;
    }
    return true;
  }

  // valida dados de pedido de orcamento de produto
  validaProduto() {
    if (!this.formProdutos.controls.mdescricao.valid) {
      this.modalService.showAlert('Informe a descrição do produto!');
      return false;
    } else if (!this.formProdutos.controls.mfabricante.valid) {
      this.modalService.showAlert('Informe o fabricante do produto!');
      return false;
    } else if (!this.formProdutos.controls.mqtd.valid) {
      this.modalService.showAlert('Informe uma quantidade válida!');
      return false;
    }
    return true;
  }

  // valida dados de pedido de orcamento de serviço
  validaServico() {

    if (!this.formCotaServico.controls.titulo.valid) {
      this.modalService.showAlert('Informe um Título!');
      return false;
    } else if (!this.formCotaServico.controls.descricao.valid) {
      this.modalService.showAlert('Informe uma Descrição!');
      return false;
    } else if (!this.formCotaServico.controls.datainiciopublicacao.valid) {
      this.modalService.showAlert('Informe a data do inicio da publicação');
      return false;
    } else if (!this.formCotaServico.controls.datafimpublicacao.valid) {
      this.modalService.showAlert('Informe a data do fim da publicação');
      return false;
    } else if (!this.formCotaServico.controls.datafimentrega.valid) {
      this.modalService.showAlert('Informe a data de termino esperada');
      return false;
    }

    return true;
  }

  limparLista() {
    this.listaProRecebida = [];
    this.formProdutos.reset();
    this.editaProduto = false;
    this.imgProd = null;
  }
  cancelaCotacao() {
    this.formCotaServico.reset();
    this.formCotaProduto.reset();
    this.listarequest = [];
    this.listaProdutos = [];
    this.listaCatOrcamento = [];
  }
  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
  }
}
