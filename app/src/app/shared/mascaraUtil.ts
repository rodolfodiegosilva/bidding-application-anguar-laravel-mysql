export class MascaraUtil {
  public static mascCpf = "000.000.000-00";
  public static mascCnpj = "00.000.000/0000-00";
  public static mascTelefone = "(00) 0000-0000||(00) 0 0000-0000";
  public static mascTelefoneFixo = "(00) 0000-0000";
  public static mascCep = "00.000-000";
  public static mascNascimento = "00/00/0000";
  // public static qtdHoras = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  // public static maskNit = [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/, /\d/, ".", /\d/, /\d/, "-", /\d/];

  public static validaTelefone = "^\\([1-9]{2}\\)[0-9]{0,1} [0-9]{4}-[0-9]{4}$";
}

export const MascUtil = {
  cpf: {
    mask: "000.000.000-00",
    valid: "^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}$"
  },
  cnpj: {
    mask: "00.000.000/0000-00",
    valid: "^\\d{2}\\.\\d{3}\\.\\d{3}\\-\\d{2}$"
  },
  telefone: {
    mask: "(00) 0000-0000||(00) 0 0000-0000",
    valid: "^\\([1-9]{2}\\) ([0-9][ ]){0,1}[0-9]{4}-[0-9]{4}$"
  },
}

