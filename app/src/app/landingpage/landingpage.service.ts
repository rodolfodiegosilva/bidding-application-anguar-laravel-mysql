import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { soliContato } from '../shared/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class LandingpageService {


constructor(private http: HttpClient) {

}

sendSoliContato(solicontato: soliContato): Observable<any> {
  return this.http.post<any>(`${environment.api_url}/solicitacontato`, solicontato);

}

}
