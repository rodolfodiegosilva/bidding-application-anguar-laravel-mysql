<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropostaprodTable extends Migration
{
    /**
     * Run the migrations.
     *php artisan migrate:refresh --path=./database/migrations/2021_01_24_225048_create_propostaprod_table.php
     * @return void
     */
    public function up()
    {
        Schema::create('propostaprod', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_fornecedor')->unsigned();
            $table->foreign('id_fornecedor')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('id_proposta')->unsigned();
            $table->foreign('id_proposta')->references('id')->on('propostas')->onDelete('cascade');
            $table->unsignedBigInteger('id_orcaproduto')->unsigned();
            $table->foreign('id_orcaproduto')->references('id')->on('orcaprodutos')->onDelete('cascade');
            $table->float('valorunitario');
            $table->float('valortotal');
            $table->date('dataentrega');
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
        Schema::dropIfExists('propostaprod');
    }
}
