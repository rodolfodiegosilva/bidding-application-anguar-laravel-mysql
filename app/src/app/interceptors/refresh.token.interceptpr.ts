import { ClassModalService } from './../shared/modal/modal.service';
import { AlertModalComponent } from '../shared/modal/alert/alert-modal.component';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, retry, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Estados } from '../shared/models/user-model';
import { Router } from '@angular/router';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private authService: AuthService,
    private router: Router,
    private modalService: ClassModalService
  ) { };

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    //    console.log(next.handle(request));
    return next.handle(request).pipe(
      // atualiza user em toda request que tiver user
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.user) {
            this.authService.usuario = evt.body.user;
            localStorage.setItem('user', btoa(JSON.stringify(evt.body.user)));
          }
        }
      }),

      catchError(errorRequest => {
        console.log(errorRequest);
        if (errorRequest.status === 401) {
          const error = errorRequest.error;
          if (error.status == 'Token is Expired') {
            if (this.isSkipRefresh(request.url)) {
              //console.log('skip refresh');
            }

            const http = this.injector.get(HttpClient);
            return http.post<any>(`${environment.api_url}/refresh`, {})
              .pipe(
                tap(data => {
                  if (data.token) {
                    localStorage.setItem('token', btoa(JSON.stringify(data.token)));
                  } else {
                    console.log('erro Token');
                  }
                }),
                flatMap(data => {
                  console.log('token renovado');

                  const cloneRequest = request.clone({ setHeaders: { 'Authorization': `Bearer ${data.token}` } });
                  return next.handle(cloneRequest);

                })
              );
            /*.flatMap((data :any) => {

             const token = JSON.parse(atob(localStorage.getItem('token')));
             const cloneRequest = request.clone({ setHeaders: { 'Authorization': `Bearer ${data.token}` } });
             return next.handle(cloneRequest);
            });*/


            console.log(error);
          }

        } else {
          if (errorRequest.error.message) {
            this.modalService.showAlert(errorRequest.error.message);
          } else {
            this.modalService.showAlert(errorRequest.message);
          }
        }
        return throwError(errorRequest).toPromise();
      }));
  }

  isSkipRefresh(url: string): boolean {

    const listaUrl: Array<any> = url.split('/');
    if (listaUrl.length > 3) {
      const skiprefresh = ['logout'];
      const strRota = listaUrl[listaUrl.length - 1];
      for (var i = 0; i < skiprefresh.length; i++) {
        if (skiprefresh[i] == strRota) {
          return true;
        }
      }
    }
    return false;
  }
}
