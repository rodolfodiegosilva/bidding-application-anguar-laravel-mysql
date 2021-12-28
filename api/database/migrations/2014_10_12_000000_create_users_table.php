<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     * php artisan migrate:refresh --path=./database/migrations/2014_10_12_000000_create_users_table.php
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name',100)->nullable();
            $table->string('apelido',100)->nullable();
            $table->integer('errocount')->default(0);
            $table->integer('id_parent')->nullable();
            $table->dateTime('errodate')->useCurrent();
            $table->dateTime('criado')->useCurrent();
            $table->string('telefone',20)->nullable();
            $table->string('email',100)->unique();
            $table->integer('isadmin')->default(0);
            $table->string('password',200);
            $table->set('tipoconta',['client', 'vendor', 'ambos']);
            $table->string('nomeempresa',150)->nullable();
            $table->string('endereco',150)->nullable();
            $table->string('complemento',150)->nullable();
            $table->string('bairro',150)->nullable();
            $table->string('cep',150)->nullable();
            $table->string('cidade',150)->nullable();
            $table->string('pais',150)->nullable();
            $table->string('estado',150)->nullable();
            $table->set('tipopessoa',['fisica', 'juridica'])->comment('fisica ou juridica');
            $table->string('cnpj',30)->nullable();
            $table->string('cpf',30)->nullable();
            $table->string('profissao',150)->nullable();
            $table->set('status',['0', '1', '2','3', '4', '5'])->comment('Criado=0,Checado=1,Aguardando=2,Aprovado=3,Reprovado=4,Bloqueado=5')->default('0');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('validakey',30)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
