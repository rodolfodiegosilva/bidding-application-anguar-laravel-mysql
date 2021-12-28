import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './../shared/auth.service';

@Injectable()
export class ClientGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  verificarAcesso() {
    if (this.authService.clientEstaAtivo()) {
      return true;
    }
    this.authService.redirecionaParaZona();
    return false;
  }

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

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.verificarAcesso();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.verificarAcesso();

  }
}
