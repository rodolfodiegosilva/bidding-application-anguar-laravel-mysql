import { HttpErrorResponse } from '@angular/common/http';

import { ClassModalService } from '../../shared/modal/modal.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Estados } from '../../shared/models/user-model';
import { AdminService } from './../admin.service';
import { AuthService } from '../../shared/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaginaNaoEncontradaComponent } from 'src/app/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { Paginate } from '../../shared/models/paginate.model'
import { ThrowStmt } from '@angular/compiler';


declare var jQuery: any;

@Component({
  selector: 'app-liberacao',
  templateUrl: './liberacao.component.html',
  styleUrls: ['./liberacao.component.css']
})

export class LiberacaoComponent implements OnInit {
  @ViewChild('ativarModal') ativarModal: ElementRef;
  @ViewChild('bloquearModal') bloquearModal: ElementRef;
  @ViewChild('mudaStatusModal') mudaStatusModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('historicoModal') historicoModal: ElementRef;

  showSpinner = false;

  paginas: Paginate[];

  tipoconta: any;
  userid: number;
  listaDocsUser = [];
  dataatualizacao: any;

  msgbloqueio: string;
  status = ['2', '3', '4'];
  statusName = { 0: 'Criado', 1: 'Checado', 2: 'Aguardando', 3: 'Aprovado', 4: 'Reprovado', 5: 'Bloqueado' };
  cnpj = '';
  email = '';

  novoStatus: any;

  listaCategoriasUser: any;
  segmentoUser: any;
  historicoUser: any;
  listaCadastros = [];
  formUser: FormGroup;
  atualQuery: any;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private alertModalService: ClassModalService
  ) { }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
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
    this.getcadastros({ status: this.status });
  }
  onChange(option) {
    if (option === 'Selecione') {
      this.status = ['2', '3', '4'];
    } else if (option === 'Criado') {
      this.status = ['0'];
    } else if (option === 'Checado') {
      this.status = ['1'];
    } else if (option === 'Aguardando') {
      this.status = ['2'];
    } else if (option === 'Aprovado') {
      this.status = ['3'];
    } else if (option === 'Reprovado') {
      this.status = ['4'];
    } else if (option === 'Bloqueado') {
      this.status = ['5'];
    } else if (option === 'Todos') {
      this.status = ['0', '1', '2', '3', '4', '5'];
    }
    this.getcadastros({ status: this.status });
  }

  confirmaAtivarconta(usuario) {
    const result = this.alertModalService.
      showConfirm('Você confirma a ativação do usuário: ' + usuario.email, 'Confirmar ativação', 'Fechar')
      .subscribe(res => {
        if (res) {
          this.ativarConta(usuario.email);
        }
      });
  }

  ativarConta(contaEmail) {
    this.showSpinner = true;
    this.adminService.ativaConta(contaEmail, Estados.Aprovado).subscribe(res => {
      if (res.detalhe === 'ok') {
        this.listaCadastros = res.user;
      }
      this.showSpinner = false;
    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.showSpinner = false;
      });
  }

  modaldebloqueio(usuario) {
    this.email = usuario;
    jQuery(this.bloquearModal.nativeElement).modal('show');
  }

  modalMudaStauts(usuario) {
    this.email = usuario;
    jQuery(this.mudaStatusModal.nativeElement).modal('show');
  }

  getcadastros(query: any, url?: string) {
    this.atualQuery = query;
    this.showSpinner = true;
    this.adminService.getcadastro(query, url).subscribe(res => {
      if (res.detalhe === 'ok') {
        this.listaCadastros = res.paginate.data;
        this.paginas = res.paginate.links;
        this.traduz();
      }
      this.showSpinner = false;
    });
  }

  getbycampo(query) {
    this.atualQuery = query;
    this.showSpinner = true;
    this.adminService.getUserByCampo(query).subscribe(res => {
      if (res.detalhe === 'ok') {
        this.listaCadastros = res.paginate.data;
        this.paginas = res.paginate.links;
        this.traduz();
      }
      this.showSpinner = false;
    });
  }
  getbylastquery(query, url: string) {
    this.showSpinner = true;
    this.adminService.getcadastro(query, url).subscribe(res => {
      if (res.detalhe === 'ok') {
        this.listaCadastros = res.paginate.data;
        this.paginas = res.paginate.links;
        this.traduz();
      }
      this.showSpinner = false;
    });
  }
  traduz() {
    if (this.paginas.length > 0) {
      this.paginas[0].label = 'Anterior';
    }
    if (this.paginas.length > 1) {
      this.paginas[this.paginas.length - 1].label = 'Próximo';
    }
  }
  getbyemail() {
    this.getbycampo({ 'campo': 'email', 'valor': this.email });
    //this.getbycampo('email', this.email);
    this.cnpj = '';
  }
  getbycnpj() {
    this.getbycampo({ 'campo': 'cnpj', 'valor': this.cnpj });
    // this.getbycampo('cnpj', this.cnpj);
    this.email = '';
  }

  async showuser(id: number) {
    this.userid = id;
    this.showSpinner = false;
    this.adminService.getUserById(id).subscribe(res => {
      console.log(res);
      if (res.detalhe === 'ok') {
        this.formUser.controls.id.setValue(res.users.id);
        this.formUser.controls.name.setValue(res.users.name);
        this.formUser.controls.email.setValue(res.users.email);
        this.formUser.controls.telefone.setValue(res.users.telefone);

        this.formUser.controls.nomeempresa.setValue(res.users.nomeempresa);
        this.formUser.controls.cnpj.setValue(res.users.cnpj);
        this.formUser.controls.cpf.setValue(res.users.cpf);

        this.formUser.controls.endereco.setValue(res.users.endereco);
        this.formUser.controls.cidade.setValue(res.users.cidade);
        this.formUser.controls.estado.setValue(res.users.estado);
        this.formUser.controls.pais.setValue(res.users.pais);
        this.formUser.controls.cep.setValue(res.users.cep);


        this.formUser.controls.tipoconta.setValue(res.users.tipoconta);
        this.dataatualizacao = res.users.updated_at;
        this.formUser.controls.status.setValue(this.statusName[res.users.status]);

        this.tipoconta = res.users.tipoconta;
        this.historicoUser = res.users.historico;


        this.listaDocsUser = [];
        for (var i = 0; i < res.users.docsuser.length; i++) {
          this.listaDocsUser.push({
            name: res.users.docsuser[i].name,
            namestore: res.users.docsuser[i].namestore
          })
        }
       // this.listaDocsUser = res.users.categorias;

        if (res.users.tipoconta === 'client') {
          this.segmentoUser = res.users.segmento.nome;
        } else if (res.users.tipoconta === 'vendor') {
          this.listaCategoriasUser = [];
          for (var i = 0; i < res.users.categorias.length; i++) {
            this.listaCategoriasUser.push({
              id: res.users.categorias[i].id,
              nome: res.users.categorias[i].nome
            })
          }
        }
        jQuery(this.formModal.nativeElement).modal('show');

      } else {
        this.alertModalService.showAlert('Erro na solicitação!', 'ERRO');
      }
      this.showSpinner = false;
      console.log(this.historicoUser);
    });
  }

  abrirHistorico(id){

    this.adminService.getUserById(id).subscribe(res => {
      console.log(res);
      if (res.detalhe === 'ok') {
        this.tipoconta = res.users.tipoconta;
        this.historicoUser = res.users.historico;
        this.email  = res.users.email;

        jQuery(this.historicoModal.nativeElement).modal('show');

      } else {
        this.alertModalService.showAlert('Erro na solicitação!', 'ERRO');
      }
      this.showSpinner = false;
      console.log(this.historicoUser);
    });

  }

  getDocs(nameStore, nameDocument) {
    this.showSpinner = true;
    this.adminService.getDocs(nameStore).subscribe(
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
          this.alertModalService.showAlert(res.detalhe);
          return;
        }
        this.showSpinner = false;
      });
  }
  notificar() {
    this.showSpinner = true;
    this.adminService.notificarConta(this.email, this.msgbloqueio).subscribe(
      (res) => {
        this.showSpinner = false;
        if (res.detalhe === 'ok') {
          this.alertModalService.showSuccess('Usuário notificado com sucesso!', 'Notificação')
            .subscribe(() => window.location.reload());
        } else {
          this.alertModalService.showAlert('Erro no requerimento da notificação!', 'ERRO')
            .subscribe(() => window.location.reload());
        }
      },
      (error) => {
        this.alertModalService.showAlert('Erro no requerimento da notificação!', 'ERRO')
          .subscribe(() => window.location.reload());
      }

    );
  }
  bloquearUser() {
    this.showSpinner = true;
    this.adminService.bloqueiaConta(this.email, this.msgbloqueio).subscribe(
      (res) => {
        this.showSpinner = false;
        if (res.detalhe === 'ok') {
          this.alertModalService.showSuccess('Usuário bloqueado com sucesso!', 'Bloqueio')
            .subscribe(() => window.location.reload());
        } else{
          this.alertModalService.showAlert('Erro no requerimento de bloqueio!', 'ERRO')
            .subscribe(() => window.location.reload());
          }
      },
      (error) => {
        this.alertModalService.showAlert('Erro no requerimento de bloqueio!')
          .subscribe(() => window.location.reload());
      }

    );
  }

  mudaStatus() {
    this.showSpinner = true;
    this.adminService.mudaStatus(this.email, this.novoStatus).subscribe((res) => {
      this.showSpinner = false;
      if (res.detalhe === 'ok') {
        jQuery(this.mudaStatusModal.nativeElement).modal('hide');
        this.alertModalService.showSuccess('Status alterado com sucesso!', 'Alteração')
          .subscribe(() => window.location.reload());
      } else {
        jQuery(this.mudaStatusModal.nativeElement).modal('hide');
        this.alertModalService.showAlert('Erro no requerimento de mudança!', 'ERRO')
          .subscribe(() => window.location.reload());
      }
    },
      (error) => {
        jQuery(this.mudaStatusModal.nativeElement).modal('hide');
        this.alertModalService.showAlert('Erro no requerimento de mudança!', 'ERRO')
          .subscribe(() => window.location.reload());
      }

    );
  }
}
