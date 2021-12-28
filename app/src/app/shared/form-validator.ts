import { FormControl } from '@angular/forms';

export class FormValidator {

    static cnpjValidator(control: FormControl) {
        const cnpj = control.value;
        var strCNPJ = cnpj.replace('.', '').replace('.', '').replace('/', '').replace('-', '');

        // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
        if (strCNPJ === '00000000000000' || strCNPJ === '11111111111111' || strCNPJ === '22222222222222' || strCNPJ === '33333333333333' ||
            strCNPJ === '44444444444444' || strCNPJ === '55555555555555' || strCNPJ === '66666666666666' || strCNPJ === '77777777777777' ||
            strCNPJ === '88888888888888' || strCNPJ === '99999999999999' || strCNPJ.length !== 14) {
            return { invalido: true };
        }
        // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
        var tamanho = strCNPJ.length - 2;
        var numeros = strCNPJ.substring(0, tamanho);
        var digitos = strCNPJ.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;

        // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
        // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número 
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.substring(tamanho - i, tamanho - i + 1)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != parseInt(digitos.substring(0, 1))) {
            return { invalido: true };
        }
        tamanho = tamanho + 1;
        numeros = strCNPJ.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let k = tamanho; k >= 1; k--) {
            soma += parseInt(numeros.substring(tamanho - k, tamanho - k + 1)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != parseInt(digitos.substring(1, 2))) {
            return { invalido: true };
        }
        return null;
    }
}
