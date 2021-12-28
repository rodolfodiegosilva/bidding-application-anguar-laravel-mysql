import { RecuperarComponent } from './telas-sem-token/recuperar/recuperar.component';
import { CadastroService } from './telas-sem-token/cadastrar/acadastro.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgxMaskModule, IConfig } from 'ngx-mask'


import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthService } from './shared/auth.service';
import { VendorGuard } from './vendor/vendor.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ContainerMenuComponent } from './container-menu/container-menu.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ValidarComponent } from './telas-sem-token/validar/validar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ClientGuard } from './client/client.guard';
import { TokenInterceptor } from './interceptors/token.interceptpr';
import { RefreshTokenInterceptor } from './interceptors/refresh.token.interceptpr';
import { ContainerModule } from './container-menu/container.module';
import { AdminComponent } from './admin/admin.component';
import { MatDialogModule } from '@angular/material';
import { AdminGuard } from './admin/admin.guard';
import { RedefinirComponent } from './telas-sem-token/redefinir/redefinir.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ContainerMenuComponent,
    LandingpageComponent,
    ValidarComponent,
    RecuperarComponent,
    RedefinirComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ContainerModule,
    ModalModule,

    ModalModule.forRoot(),
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    }),

  ],
  providers: [
    /* Habilita jogo da velha # {
       provide: LocationStrategy, useClass: HashLocationStrategy
     },*/
    AuthService,
    AuthGuard,
    VendorGuard,
    ClientGuard,
    AdminGuard,
    CadastroService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
