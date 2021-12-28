<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrcaprodutosTable extends Migration
{
    /**
     * Run the migrations.
     *php artisan migrate:refresh --path=./database/migrations/2021_01_09_210352_create_orcaprodutos_table.php
     * @return void
     */
    public function up()
    {
        Schema::create('orcaprodutos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_orcamento')->unsigned();
            $table->foreign('id_orcamento')->references('id')->on('orcamentos')->onDelete('cascade');
            $table->string('partnumber')->nullable();
            $table->string('ncm')->nullable();
            $table->string('descricao');
            $table->integer('qtd');
            $table->string('fabricante');
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
        Schema::dropIfExists('orcaprodutos');
    }
}
