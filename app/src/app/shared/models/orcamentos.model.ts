export interface OrcamentoClient{
  id: number,
  titulo: String,
  tipo: String,
  publicado: Date,
  diasativo: number,
  entrega: Date,
  descricao: String,
  categoria: String,
  subcategoria: String,
  qtdPropostas: number,
  temTabela: boolean,
  status: String,
  show: boolean,
  temvisita: boolean
}
  /*



  orcaid: number,
  titulo: String,
  tipo: String,
  publicado: Date,
  diasativo: Number,
  descricao: String,
  categoria: String,
  subcategoria: String,

  prazoentrega: 8,
  qtdPropostas: 2,
  temTabela: true,
  show: true,
  showProposta: false,
  proposta: null,
  escondeeditar: null,
  status: "aberto",

  //se o pedido tiver porposta preenche, se não fica null
  propoid: row.propoid,
  descricaoproposta: row.descricaoproposta,
  dataentrega: row.dataentrega
}
