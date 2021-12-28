import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseUser } from 'src/app/shared/models/user-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BemvindoService {
  getUserTipoConta() {
    return this.authService.getUserTipoConta();
  }
  getUserTipoPessoa() {
    return this.authService.getUserTipoPessoa();
  }
  getUserStatus() {
    return this.authService.getUserStatus();
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMyDocument(filename: string): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/getmydocbynome`, {fileName: filename});
  }

  salvaContaPF(myRequest): Observable<any> {
    return this.http.post<ResponseUser>(`${environment.api_url}/updatebemvindo`, myRequest);
  }

  salvaContaPj(formdata): Observable<any> {
//    return this.http.post<ResponseUser>(`${environment.api_url}/updatebemvindo`, formdata);
    return this.http.post<ResponseUser>(`${environment.api_url}/updatebemvindo`, formdata);
  }

  pegaCategoriasbylike(palavra: string): Observable<any> {
    const myRequest = {
      palavra: palavra,
    }
    //console.log(myRequest);
    return this.http.post<ResponseUser>(`${environment.api_url}/pegacategoriasbylike`, myRequest);
  }

  pegaSeguimentos(): Observable<any> {

    //console.log(myRequest);
    return this.http.get<ResponseUser>(`${environment.api_url}/pegasegmentos`);
  }

  pegaEstados(): Observable<any> {

    //console.log(myRequest);
    return this.http.get<ResponseUser>(`${environment.api_url}/pegaestados`);
  }

  pegaMunicipios(estado): Observable<any> {
    const myRequest = {
      estado: estado
    }
    //console.log(myRequest);
    return this.http.post<ResponseUser>(`${environment.api_url}/pegamunicipios`,myRequest);
  }

  meuCadastro(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/meucadastro`);
  }

}
