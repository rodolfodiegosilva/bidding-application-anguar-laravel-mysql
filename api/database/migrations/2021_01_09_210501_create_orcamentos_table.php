<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrcamentosTable extends Migration
{
    /**
     * Run the migrations.
     * php artisan migrate:refresh --path=./database/migrations/2021_01_09_210501_create_orcamentos_table.php
     * @return void
     */
    public function up()
    {
        Schema::create('orcamentos', function (Blueprint $table) {
            $table->id();
            $table->integer('id_client');
            $table->set('orcamento',['s','p'])->comment('s=serviço,p=produto');
            $table->string('titulo');
            $table->string('descricao',1000);
            $table->string('status',100)->nullable();
            $table->boolean('temvisita');
            $table->date('datainiciopublicacao');
            $table->date('datafimpublicacao');
            $table->date('datafimentrega');
            $table->date('datainiciovisita')->nullable();
            $table->date('datafimvisita')->nullable();
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
        Schema::dropIfExists('orcamentos');
    }
}
