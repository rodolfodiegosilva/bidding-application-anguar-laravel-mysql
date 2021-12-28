import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subscriber, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseC, RequestC } from '../../shared/models/user-model';

@Injectable()
export class CadastroService {

  constructor(private http: HttpClient) { }

  private url: string = "http://mysquare.com.br"

  private urlUser: string = this.url + "/api_dados/reques_user.php";

  getCadastra(obj_cadastro: any): Observable<any> {
    console.log('aqui')
    return this.http.post(`${environment.api_url}/cadastrar`, obj_cadastro).pipe(
      tap(),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  getUsers(respt: RequestC): Observable<ResponseC> {
    return this.http.post<ResponseC>(this.urlUser, JSON.stringify(respt));
  }

  existeEmail(email: string): Observable<any> {
    return this.http.post(`${environment.api_url}/existeemail`, {'email' : email});
  }

}
