import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { Estados, RequestUser, ClassUser, ResponseUser, ClassOrcamento, ResponseOrcamento, ListadeProdutos } from './models/user-model';

import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConstantPool } from '@angular/compiler';
import { resourceUsage } from 'process';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  enviaEmailConfirmacao(email): Observable<any> {
    console.log(email);
    return this.http.post(`${environment.api_url}/enviaremailconfirmacao`, { 'email': email });
  }
  getUserTipoConta() {
    return this.usuario.tipoconta;
  }
  getUserTipoPessoa() {
    return this.usuario.tipopessoa;
  }
  getUserStatus() {
    if (this.usuario) {
      if ([Estados.Aguardando].includes(this.usuario.status)) {
        localStorage.clear();
      }
      return this.usuario.status;
    }
    else
      return '-1';
  }

  isClient() {
    return this.usuario.tipoconta == 'client';
  }
  isVendor() {
    return this.usuario.tipoconta == 'vendor';
  }

  private userAutenticado: boolean = false;
  private emailChacado: boolean = false;

  private vendorAtivo: boolean = false;
  private clientAtivo: boolean = false;

  myRequest: RequestUser;

  //mostrarMenuEmitter = new EventEmitter<ClassUser>();

  private url: string = "ss"
  private urlUser: string =  "/api_dados/reques_user.php";
  private urlClient: string =  "/api_dados/reques_client.php";

  usuario: ClassUser;
  token: String;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  /////////////////////////////////////////////  V2.0  /////////////////////////////////////////////
  /** verifica se existem uma secao */
  check(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  /** faz login no back */
  requestdeLogin(usuario: ClassUser): Observable<boolean> {
    return this.http.post<any>(`${environment.api_url}/login`, usuario).pipe(
      tap(data => {
        if ([
          Estados.Checado,
          Estados.Aguardando,
          Estados.Aprovado].includes(data.user.status)) {
          this.autenticaUser(data.user, data.token);
        } else {
          this.desautenticaUser();
          this.usuario = data.user;
        }
      }),
      catchError((errorRequest: HttpErrorResponse) => {
        return throwError(errorRequest).toPromise();
      })
    );
  }

  /** Salva login */
  atualizaUsuario(user: ClassUser) {
    this.usuario = user;
    if (this.usuario.tipoconta == "vendor") {
      localStorage.setItem('user', btoa(JSON.stringify(this.usuario)));
      this.vendorAtivo = true;
    } else if (this.usuario.tipoconta == "client") {
      localStorage.setItem('user', btoa(JSON.stringify(this.usuario)));
      this.clientAtivo = true;
    }
  }

  /** Ler login */
  lerLogin() {
    if (localStorage.getItem('user')) {
      this.usuario = JSON.parse(atob(localStorage.getItem('user')));
      this.token = JSON.parse(atob(localStorage.getItem('token')));
      this.autenticaUser(this.usuario, this.token);
      // this.fazerLogin(this.usuario,false);
      return true;
    } else
      return false;
  }

  desautenticaUser() {
    this.usuario = null;
    this.token = '';
    localStorage.clear();
    this.userAutenticado = false;
    this.clientAtivo = false;
    this.vendorAtivo = false;
   // this.mostrarMenuEmitter.emit(null);
  }

  autenticaUser(usuario: ClassUser, token: String) {
    this.usuario = usuario;
    this.token = token;
    if (this.usuario.tipoconta == "vendor" || this.usuario.tipoconta == "client") {
      localStorage.setItem('user', btoa(JSON.stringify(this.usuario)));
      localStorage.setItem('token', btoa(JSON.stringify(this.token)));
    }

    this.userAutenticado = true;

    if (usuario.status == Estados.Checado || usuario.status == Estados.Aguardando) {
      this.clientAtivo = false;
      this.vendorAtivo = false;
    } else if (usuario.status == Estados.Aprovado) {
      /* Seta variaveis de rotas*/
      if (usuario.tipoconta == "vendor") {
        this.vendorAtivo = true;
        this.clientAtivo = false;
      } else if (usuario.tipoconta == "client") {
        this.vendorAtivo = false;
        this.clientAtivo = true;
      }
    }
    /* Emite um evento para o ContainerMenuComponent*/
    // this.mostrarMenuEmitter.emit(usuario);
  }

  fazerLogOff(): any {
    return this.http.get<any>(`${environment.api_url}/logout`);
  }

  pegaMeusDados(): Observable<any> {
    if (!localStorage.getItem('user')) {
      return null;
    }

    return this.http.get<any>(`${environment.api_url}/me`).pipe(
      tap(data => {
        //console.log(data);
        if (!data.status) {
          this.autenticaUser(data.user, data.token);
        }
      }),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        this.desautenticaUser();
        // this.router.navigate(['/home']);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  pegaProfile(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/getprofile`);
  }


  validador(codigo: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/validaconta`, { "validakey": codigo });
  }
  salvaMeusDados(myDados: any): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/updateacc`, myDados);
  }



  redefineSenha(myRequest): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/redefinesenha`, myRequest);
  }

  temCodigo(myRequest: any): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/temcodigo`, myRequest);
  }

  redirecionaParaZona() {
    if ([Estados.Checado, Estados.Aguardando].includes(this.getUserStatus())) {
      this.router.navigate(['/conta/bemvindo']);
    } else if (this.getUserStatus() == Estados.Aprovado) {
      if (this.usuario.tipoconta == 'client') {
        this.clientAtivo = true;
        const rotacliente = "/" + this.getUserTipoConta() + "/orcamentos";
        this.router.navigate([rotacliente]);
      } else if (this.usuario.tipoconta == 'vendor') {
        this.vendorAtivo = true;
        const rotacliente = "/" + this.getUserTipoConta() + "/classificados";
        this.router.navigate([rotacliente]);
      } else {
        alert('Erro de Sistema!');
        console.log(this.usuario);
      }
    }
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/recuperarsenha`, { email: email });
  }


  /////////////////////////////////////////////REVISAR/////////////////////////////////////////////


  alterarSenha(my): Observable<any> {
    const myRequest = {
      acao: 'alterasenha',
      dado: my
    };

    return this.http.post<ResponseUser>(this.urlUser, myRequest);
  }

  /*sendPedidoProduto(orcamento: ClassOrcamento, lsprod: ListadeProdutos[]): Observable<ResponseOrcamento> {
    const myrequest = {
      acao: 'orcaproduto',
      token: this.token,
      dado: orcamento,
      lista: lsprod
    };

    return this.http.post<ResponseOrcamento>(this.urlClient, myrequest);
  }*/

  /*
    sendPedidoServico(orcamento: ClassOrcamento): Observable<ResponseOrcamento> {
      const myrequest = {
        acao: 'orcaservico',
        token: this.token,
        dado: orcamento
      };
      //   myrequest.dado.id_client = 1; // setar id do cliente
      return this.http.post<ResponseOrcamento>(this.urlClient, myrequest);
    }*/

  /*getMyPedidoOrcamentos(): Observable<any> {
    const myrequest = {
      acao: 'getmypedidos',
      token: this.token,
      id_client: 1 // setar id do cliente
    };
    return this.http.post<any>(this.urlClient, myrequest);
  }*/

  getcadastro() {// migrar
    const myrequest = {
      acao: 'getnewusers',
      dado: 'ltrim(status)<3'
    };
    return this.http.post<any>(this.urlUser, myrequest);
  }

  /*existeToken(token: string): Observable<any> {
    const myrequest = {
      acao: 'existT',
      dado: token
    };
    return this.http.post<any>(this.urlUser, myrequest).pipe(
      map(res => {
        if (res.msg == "logado") {
          // console.log("blz");
          this.fazerLogin(res.dado, false);
          return true;
        } else {
          return false;
        }
      }),
      catchError((err) => {
        return of(false);
      })

    );
  }*/

  usuarioEstaAutenticado() {
    return this.userAutenticado;
  }

  vendorEstaAtivo() {
    return this.vendorAtivo;
  }

  clientEstaAtivo() {
    return this.clientAtivo;
  }

  adminEstaAtivo() {
    return this.usuario.isadmin;
  }

  emailChecado() {
    return this.emailChacado;
  }



  /* recuperaLogin() {
     const myVaruser: string = localStorage.getItem('mysquareuser');
     const myVartoken: string = localStorage.getItem('mysquaretoken');
     if (myVaruser && myVartoken) {
       this.userAutenticado = true;
       const tipo = myVartoken.substring(0, 1);
       if (tipo == "0") {
         this.fornecedorAtivo = true;
         this.clientAtivo = false;
       } else if (tipo == "1") {
         this.fornecedorAtivo = false;
         this.clientAtivo = true;
       }

       console.log("alguem");
       return true;

     } else {
       return false;
     }
   }*/


}
