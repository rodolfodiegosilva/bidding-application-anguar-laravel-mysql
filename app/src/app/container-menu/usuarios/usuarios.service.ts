import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/getusers`);
  }

  cadastraUsuario(novousuario: any): Observable<any> {
    return this.http.post(`${environment.api_url}/cadastraruserchildren`, novousuario).pipe(
      tap(),
      catchError((errorRequest: HttpErrorResponse) => {
        console.log(errorRequest);
        return throwError(errorRequest).toPromise();
      })
    );
  }

  excluirUsuario(id: any): Observable<any> {

    return this.http.post(`${environment.api_url}/excluiruser`, {'id': id});
  }
  bloquearUsuario(id: any): Observable<any> {

    return this.http.post(`${environment.api_url}/bloquearuser`, {'id': id});
  }

  desbloquearUsuario(id: any): Observable<any> {

    return this.http.post(`${environment.api_url}/desbloquearuser`, {'id': id});
  }

}
