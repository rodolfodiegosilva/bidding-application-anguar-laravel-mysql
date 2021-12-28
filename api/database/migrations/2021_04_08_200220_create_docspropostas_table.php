<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocspropostasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('docspropostas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_proposta')->unsigned();
            $table->foreign('id_proposta')->references('id')->on('propostas')->onDelete('cascade');
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
        Schema::dropIfExists('docspropostas');
    }
}
