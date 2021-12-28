# Sitema de Web E-mail em Angular consumindo uma Api-rest em PHP (Laravel)

## Utilização da Api-Rest em PHP (Laravel)

### Instalção do SGBG MySql

A api esta configurada para fazer consulta no SGB MySql.

Um modo mais prático de usar esse SGBD é utilizando umas das ferramentas de pacotes de servidores de código aberto no mercado, uma dessas ferramentas é o  XAMPP, que pode ser baixado  aqui [Instalador](https://getcomposer.org)

Com a instalação da ferramenta XAMPP vem o aplicativo phpMyAdmin. Depois de startar o XAMMP no caminho ```http://localhost/phpmyadmin/index.php``` você poderá a aplicação phpMyAdmin.

Crie um banco de dados com o nome "emails_db" e faça a importação por meio do arquivo "emails_db.sql" que esta no repositório do projeto.

### Api PHP (Laravel)
Instale o mecanismo PHP. A versão com suporte é o PHP8. 
Os downloads estão disponíveis aqui: [Instalador](https://www.php.net/downloads.php)

Instale o gerenciador de pacotes para linguagem PHP Composer.
Gerenciador Composer: [Instalador](https://getcomposer.org)

Na pasta "api" do projeto após a instalação do Composer , rode o servidor usando o comando:

```php
php artisan serve
```

Pronto, a api está rodando na porta ``` http://localhost:8000 ```  e pronto para ser consuida.


Para verificar todos os e-mails cadastrado, envie uma requisição GET para o caminho ``` http://localhost:8000/api/getemails ```, terá como response o seguinte JSON:
```json
{
    "response": "ok",
    "emails": [
        {
            "id": 23,
            "subject_email": "O que é Lorem Ipsum?",
            "message_email": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.",
            "created_at": "2021-07-21T20:23:06.000000Z",
            "updated_at": "2021-07-21T20:23:06.000000Z",
            "emailaddress": [
                {
                    "id": 1,
                    "email_address": "admin@gmail.com",
                    "created_at": "2021-07-17T00:59:43.000000Z",
                    "updated_at": "2021-07-17T00:59:43.000000Z",
                    "pivot": {
                        "email_id": 23,
                        "emails_address_id": 1
                    }
                }
            ]
        },
        {
            "id": 24,
            "subject_email": "Porque nós o usamos?",
            "message_email": "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de \"Conteúdo aqui, conteúdo aqui\", fazendo com que ele tenha uma aparência similar a de um texto legível. Muitos softwares de publicação e editores de páginas na internet agora usam Lorem Ipsum como texto-modelo padrão, e uma rápida busca por 'lorem ipsum' mostra vários websites ainda em sua fase de construção. Várias versões novas surgiram ao longo dos anos, eventualmente por acidente, e às vezes de propósito (injetando humor, e coisas do gênero).",
            "created_at": "2021-07-21T20:23:29.000000Z",
            "updated_at": "2021-07-21T20:23:29.000000Z",
            "emailaddress": [
                {
                    "id": 2,
                    "email_address": "admin@gmail.com",
                    "created_at": "2021-07-20T19:38:25.000000Z",
                    "updated_at": "2021-07-20T19:38:25.000000Z",
                    "pivot": {
                        "email_id": 24,
                        "emails_address_id": 2
                    }
                }
            ]
        }....
}
```

Para salvar um email, envie uma requisição POST para o caminho``` http://localhost:8000/api/saveemail ``` contendo no corpo da requisição os seguintes objetos no formato JSON:

```json
{
    "id": null,
    "recipients": "admin@gmail.com",
    "subjectEmail": "Assunto do e-mail",
    "message": "messagem do corpo do e-email"

}
```

Terá como resnpose de requisisão bem sucessedida o seguinte JSON:
```json
{
    "response": "ok",
}
````

Para editar um e-mail, envie uma requisição POST para o caminho``` http://localhost:8000/api/saveemail ``` contendo no corpo da requisição os seguintes objetos no formato JSON:

```json
{
  "id": 23, //Id do e-email ja existente na base de dados.
  "recipients": "admin@gmail.com",
  "subjectEmail": "Assunto do e-mail",
  "message": "messagem do corpo do e-email"
}
```


Terá como resnpose de requisisão bem sucessedida o seguinte JSON:
```json
{
    "response": "ok",
}
````


Para deletar um e-mail, envie uma requisição POST para o caminho``` http://localhost:8000/api/deleteemail ``` contendo no corpo da requisição os seguintes objetos no formato JSON:

```json
{
  "idemail": 23, //Id do e-email ja existente na base de dados.
}
```

Terá como resnpose de requisisão bem sucessedida o seguinte JSON:
```json
{
    "response": "ok",
}
````

Para pesquisar um email por meio de match de caracters nos campos: endereço de email, assunto e corpo da menssagem, envie uma requisição POST para o caminho``` http://localhost:8000/api/getemailssearch``` contendo no corpo da requisição os seguintes objetos no formato JSON:

```json
{
    "characters":"adimin@"
}
```


Terá como resnpose de requisisão bem sucessedida o seguinte JSON:
```json
{
    "response": "ok",
    "emails": [
        {
            "id": 23,
            "subject_email": "O que é Lorem Ipsum?",
            "message_email": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.",
            "created_at": "2021-07-21T20:23:06.000000Z",
            "updated_at": "2021-07-21T20:23:06.000000Z",
            "emailaddress": [
                {
                    "id": 1,
                    "email_address": "admin@gmail.com",
                    "created_at": "2021-07-17T00:59:43.000000Z",
                    "updated_at": "2021-07-17T00:59:43.000000Z",
                    "pivot": {
                        "email_id": 23,
                        "emails_address_id": 1
                    }
                }
            ]
        },
        {
            "id": 24,
            "subject_email": "Porque nós o usamos?",
            "message_email": "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de \"Conteúdo aqui, conteúdo aqui\", fazendo com que ele tenha uma aparência similar a de um texto legível. Muitos softwares de publicação e editores de páginas na internet agora usam Lorem Ipsum como texto-modelo padrão, e uma rápida busca por 'lorem ipsum' mostra vários websites ainda em sua fase de construção. Várias versões novas surgiram ao longo dos anos, eventualmente por acidente, e às vezes de propósito (injetando humor, e coisas do gênero).",
            "created_at": "2021-07-21T20:23:29.000000Z",
            "updated_at": "2021-07-21T20:23:29.000000Z",
            "emailaddress": [
                {
                    "id": 2,
                    "email_address": "admin@gmail.com",
                    "created_at": "2021-07-20T19:38:25.000000Z",
                    "updated_at": "2021-07-20T19:38:25.000000Z",
                    "pivot": {
                        "email_id": 24,
                        "emails_address_id": 2
                    }
                }
            ]
        }....
}
```
## Utilização da Aplicação Web E-mail (Angular)

Para instalar o Angular em seu sistema local, você precisa do seguinte:
Node.js

Angular requer um LTS ativo ou LTS de manutenção versão do Node.js.
Os downloads estão disponíveis aqui: [Instalador](https://nodejs.org/en/)

Instale o Angular CLI
Você usa a CLI Angular para criar projetos, gerar código de aplicativo e biblioteca e executar uma variedade de tarefas de desenvolvimento contínuas, como teste, empacotamento e implantação.

Para instalar o Angular CLI, abra uma janela de terminal e execute o seguinte comando:

```php
npm install -g @angular/cli
```

Na pasta "app" do projeto após a instalação do NodeJs e o Angular Cli, rode a aplicação usando o comando:

```php
ng serve 
```
