import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropostaServico, ListadeProdutos } from '../shared/models/user-model';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class VendorAuthService {


  private url = 'http://mysquare.com.br'
  private urlVendor: string = this.url + '/api_dados/request_vendor.php';

  constructor(
    private http: HttpClient
  ) {}

  /* envia um id e retorna um array de produtos do mesmo*/
  getProdutos(myId:string):Observable<any>{
    /*const myrequest = {
      acao: 'getprodutos',
      dado: myId
    };
    return this.http.post<any>(this.urlVendor, myrequest);*/
    //console.log(myId);
    return this.http.post<any>(`${environment.api_url}/getprodutosorcamento`, {myId: myId});
  }
  getPedidoOrcamentos(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/pedidoscliente`);
  }

  sendPropostaServico(item):Observable<any>{
    const myrequest = item;
    console.log(myrequest);
    return this.http.post<any>(`${environment.api_url}/propostaservico`, myrequest);

   }
   sendPropostaProduto(listadeprodutos, item): Observable<any>{
    // console.log(listadeprodutos);
     //console.log(item);
     const myrequest = {
       orcaid: item.orcaid,
       descricaoproposta: item.descricaoproposta,
       arquivo: item.arquivo
     };
     myrequest['produtos'] = listadeprodutos;
     console.log(myrequest);

     return this.http.post<any>(`${environment.api_url}/propostaprod`, myrequest).pipe(
       tap(data => {
        // console.log(data);
       }),
       catchError((errorRequest: HttpErrorResponse) => {
         //console.log(errorRequest);
         return throwError(errorRequest).toPromise();
       })
     );
   }

   getDocProposta(myrequest): Observable<any> {

    return this.http.post<any>(`${environment.api_url}/getdocproposta`,{'namestore':myrequest});
    }

   sendAtualizacaoProposta(listadeprodutos, item):Observable<any>{
    const myrequest = {
      propoid: item.propoid,
      descricaoproposta: item.descricaoproposta,
      dataentrega: item.dataentrega
    };
    myrequest['produtos'] = listadeprodutos;
    console.log(myrequest);

    return this.http.post<any>(`${environment.api_url}/atualizarproposta`,myrequest);

   }

   excluirProposta(myId:string):Observable<any>{
    const myrequest = {
      myId: myId
    };
    // console.log(myrequest);

    return this.http.post<any>(`${environment.api_url}/excluirproposta`,myrequest);

   }
}
