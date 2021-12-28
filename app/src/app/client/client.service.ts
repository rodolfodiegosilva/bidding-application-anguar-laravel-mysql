import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClassOrcamento, ListadeProdutos, ResponseOrcamento, ResponseUser } from '../shared/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getMyPedidoOrcamentos(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/mypedidoscliente`);
  }
  pegaCategoriasbylike(palavra: string): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/pegacategoriasbylike`, {'palavra':palavra});
  }

  encerrarCotacao(cotacao, msgence): Observable<any> {
    const myRequest = {
      id: cotacao.id,
      msg: msgence
    }
    console.log(myRequest);
    return this.http.post<ResponseUser>(`${environment.api_url}/encerrarcotacao`, myRequest);
  }
  getMyOrcamentoRecebido(myId: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/mypropostacliente`, { 'myId': myId });
  }

  getProposta(idproposta: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/getproposta`, { 'id': idproposta });
  }

  suspenderCotacao(idcotacao: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/suspendercotacao`, { 'id': idcotacao });
  }

  reabrirCotacao(idcotacao: string, res): Observable<any> {
    console.log(res);
    const myRequest = {
      id: idcotacao,
      dataentrega: res.dataentrega,
      datainicio: res.datainicio,
      datafim: res.datafim
    };
    return this.http.post<any>(`${environment.api_url}/reabrircotacao`, myRequest);
  }

  sendPedidoServico(orcamento: ClassOrcamento, categorias, value): Observable<ResponseOrcamento> {
    console.log(value);
    orcamento['temvisita'] = value;
    orcamento['categorias'] = categorias;

    return this.http.post<ResponseOrcamento>(`${environment.api_url}/orcaservico`, orcamento);
  }
  sendPedidoProduto(orcamento: ClassOrcamento, lsprod: ListadeProdutos[], categorias, temvisita: Boolean): Observable<ResponseOrcamento> {
    orcamento.temvisita = temvisita;
    orcamento['produtos'] = lsprod;
    orcamento['categorias'] = categorias;

    return this.http.post<any>(`${environment.api_url}/orcaproduto`, orcamento).pipe(
      tap(data => {
        console.log(data);
      }),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  getImgProfile(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/getimgprofile`);
  }

  getDocProposta(myrequest): Observable<any> {

    return this.http.post<any>(`${environment.api_url}/getdocpropostaforn`,{'namestore':myrequest});
  }

}
