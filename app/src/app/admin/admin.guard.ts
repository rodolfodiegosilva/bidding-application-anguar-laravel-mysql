import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { ClassModalService } from '../shared/modal/modal.service';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private authService: AuthService,
        private router: Router,
        private modalService: ClassModalService,
    ) { }

    verificarAcesso() {
        if (this.authService.adminEstaAtivo()) {
            return true;
        }
        this.authService.redirecionaParaZona();
        return false;
    }

    canLoad(route: Route
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.usuario) {
            this.authService.lerLogin();
        }
        if (this.authService.adminEstaAtivo()) {
            return true;
        }else{
            this.modalService.showAlert("A área que vocês esta tentando acessar não é permitida!");
            return false;
        }
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