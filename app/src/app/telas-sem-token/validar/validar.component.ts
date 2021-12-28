import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

declare var jQuery: any;


@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.css']
})
export class ValidarComponent implements OnInit {
  componentShow: boolean = false;

  @ViewChild('alertaModal') alertaModal: ElementRef;
  strAlerta: string;
  showStrAlerta: Boolean = false;

  showSpinner: boolean = false;
  code: string;

  constructor(
    private authservice: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.params['cod'];
    if (this.code) {
      this.validaConta(this.code);
    }
  }

  validaConta(code) {
    this.showSpinner = true;
    this.authservice.validador(code).subscribe(res => {
      if (res.detalhe == "null") {
        this.mostraAlerta("O código de ativação não é válido!");
      } else if (res.detalhe == "ok") {
        this.componentShow = true;
      } else {
        this.mostraAlerta("Sistema fora de funcionamento!");
        console.log(res);
      }
      this.showSpinner = false;
    });
  }

  mostraAlerta(mgs: string) {
    this.strAlerta = mgs;
    this.showStrAlerta = true;

    jQuery(this.alertaModal.nativeElement).modal("show");
  }

}
