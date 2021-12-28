import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../shared/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canLoad(route: Route
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.usuarioEstaAutenticado()) {
      return true;
    }
    if (!this.authService.usuario) {
      this.authService.lerLogin();
    }
    return this.authService.usuarioEstaAutenticado();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    if (this.authService.usuarioEstaAutenticado()) {
      return true;
    }

    if (!this.authService.usuario) {
      this.authService.lerLogin();
    }

    return this.authService.usuarioEstaAutenticado();
    //return this.authService.lerLogin();

  }

}
