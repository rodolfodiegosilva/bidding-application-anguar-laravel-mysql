import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const requestUrl: Array<any> = request.url.split('/');
        const apiUrl: Array<any> = environment.api_url.split('/');

        if (localStorage.getItem('token') && (requestUrl[2] == apiUrl[2])) {
            const token = JSON.parse(atob(localStorage.getItem('token')));

            const newRequest = request.clone({ setHeaders: { 'Authorization': `Bearer ${token}` } });
            return next.handle(newRequest);

        }

        return next.handle(request);

    }
}
