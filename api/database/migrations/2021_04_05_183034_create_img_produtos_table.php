<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImgProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('imgprodutos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_produto')->unsigned();
            $table->foreign('id_produto')->references('id')->on('orcaprodutos')->onDelete('cascade');
            $table->string('name',100)->nullable();
            $table->string('namestore',200);
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
        Schema::dropIfExists('img_produtos');
    }
}
