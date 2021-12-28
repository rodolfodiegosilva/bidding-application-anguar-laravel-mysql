import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  getcadastro(query,url?) {
    const myUrl = url ? url : `${environment.api_url}/getcadastros`;
    return this.http.post<any>(myUrl, query).pipe(
      tap(() => { }),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  ativaConta(email: string, status: string): Observable<any> {
    const myrequest = {
      email: email,
      status: status
    };
    return this.http.post<any>(`${environment.api_url}/setstatus`, myrequest);
  }

  bloqueiaConta(email: string, msg: string): Observable<any> {
    const myrequest = {
      email: email,
      msg: msg
    };
    return this.http.post<any>(`${environment.api_url}/bloqueiconta`, myrequest);
  }

  notificarConta(email: string, msgbloqueio: string) {
    const myrequest = {
      email: email,
      msg: msgbloqueio
    };
    return this.http.post<any>(`${environment.api_url}/notificarConta`, myrequest);
  }

  mudaStatus(email: string, novostatus): Observable<any> {
    const myrequest = {
      email: email,
      novostatus: novostatus
    };
    return this.http.post<any>(`${environment.api_url}/mudastatus`, myrequest);
  }

  getUserByCampo(myrequest) {
    return this.http.post<any>(`${environment.api_url}/getuserbycampo`, myrequest).pipe(
      tap(() => { }),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  getUserById(id) {
    return this.http.post<any>(`${environment.api_url}/getuserbyid`, { 'id': id }).pipe(
      tap(() => { }),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  getuserbyid(): Observable<any> {
    return this.http.get(`${environment.api_url}/getdocsclient`);
  }

  getDocs(myrequest): Observable<any> {

    return this.http.post<any>(`${environment.api_url}/getdocsclient`,{'namestore':myrequest});
  }


}

