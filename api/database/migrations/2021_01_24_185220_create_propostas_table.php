<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropostasTable extends Migration
{
    /**
    * Run the migrations.
     * php artisan migrate:refresh --path=./database/migrations/2021_01_24_185220_create_propostas_table.php
     * @return void
     */
    public function up()
    {
        Schema::create('propostas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_fornecedor')->unsigned();
            $table->foreign('id_fornecedor')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('id_orcamento')->unsigned();
            $table->foreign('id_orcamento')->references('id')->on('orcamentos')->onDelete('cascade');
            $table->text( 'proposta',10000);
            $table->double( 'valorservico')->nullable();;
            $table->boolean('podeeditar')->default(false);
            $table->date('dataentrega')->nullable();
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
        Schema::dropIfExists('propostas');
    }
}
