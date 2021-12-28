import { BemvindoService } from './bemvindo.service';
import { Estados, TipoPessoa, TipoConta } from '../../shared/models/user-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-bemvindo',
  templateUrl: './bemvindo.component.html',
  styleUrls: ['./bemvindo.component.css']
})
export class BemvindoComponent implements OnInit {

  constructor(
    private bemvindoService: BemvindoService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  showbemvindo(){
    return this.bemvindoService.getUserStatus() === Estados.Checado;
  }
  showaguardando(){
    return this.bemvindoService.getUserStatus() === Estados.Aguardando;
  }

  isPJVendor(){
    return this.bemvindoService.getUserTipoPessoa() === TipoPessoa.Juridica &&
    this.bemvindoService.getUserTipoConta() === TipoConta.Fornecedor;
  }

  isPFVendor(){
    return this.bemvindoService.getUserTipoPessoa() === TipoPessoa.Fisica &&
    this.bemvindoService.getUserTipoConta() === TipoConta.Fornecedor;
  }

  isPJClient(){
    return this.bemvindoService.getUserTipoPessoa() === TipoPessoa.Juridica &&
     this.bemvindoService.getUserTipoConta() === TipoConta.Consumidor;
  }

  isPFClient(){
    return this.bemvindoService.getUserTipoPessoa() === TipoPessoa.Fisica &&
     this.bemvindoService.getUserTipoConta() === TipoConta.Consumidor;
  }

}
