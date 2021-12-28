export interface ClassUser {
  id: number,
  name: string,
  apelido: string,
  email: string,
  endereco: string,
  bairro: string,
  complemento: string,
  cep: string,
  cidade: string,
  estado: string,
  pais:string,
  categoria: string,
  subcategoria: string,
  cnpj: string,
  cpf: string,
  profissao: string,
  telefone: string,
  password: string,
  tipoconta: string,
  tipopessoa: string,
  nomeempresa: string,
  status: string,
  isadmin: boolean
}

export interface RequestUser {
  acao: string,
  dado: ClassUser
}

export interface ResponseUser {
  msg: string,
  dado: ClassUser
}


export interface RequestC {
  name: string;
  job: string;
}

export interface ResponseC {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}
/* estruturas de orcamento */
export interface ClassOrcamento {
  id_client: number,
  orcamento: string,// s = servico ou p = produto
  titulo: string,
  diasativo: number,
  descricao: string,
  categoria: string,
  subcategoria: string,
  temvisita: Boolean
}

export interface PropostaServico {
  descricaoproposta: string,
  dataentrega: Date
}

export interface RequestOrcamento {
  acao: string,
  dado: ClassOrcamento,
  lista: ListadeProdutos[]
}
export interface ResponseOrcamento {
  msg: string, // apagar depois que migrar tudo!!
  detalhe: string,
  dado: ClassOrcamento
}

export interface ResponseDate {
 value: boolean;
 asObservable();
}

export interface ListadeProdutos {
  mvlrproduto: any;
  mvlrfrete: any;
  mvalortotalprods: any;
  vlrproduto: any;
  vlrfrete: any;
  valortotalprods: any;
  mpartnumber: string,
  mncm: string,
  mdescricao: string,
  mqtd: number,
  mfabricante: string,
  dataentrega: Date,
  total: number,
  valor: number,
  mimagem: string
}

export interface soliContato {
  email: string,
  tel: string,
  msg: string,
}


/* Fim estruturas de orcamento */

export const Estados = {
  Criado: '0',
  Checado: '1',  // email foi checado
  Aguardando: '2',
  Aprovado: '3',
  Reprovado: '4',
  Bloqueado: '5'
};

export const TipoConta = {
  Fornecedor: 'vendor',
  Consumidor: 'client'
};

export const TipoPessoa = {
  Fisica: 'fisica',
  Juridica: 'juridica'
};
