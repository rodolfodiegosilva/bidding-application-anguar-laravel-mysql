<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSolicitacaocontatoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solicitacaocontato', function (Blueprint $table) {
            $table->id();
            $table->string('email',100)->nullable();
            $table->string('telefone',20)->nullable();
            $table->string('mensagem',400)->nullable();
            $table->boolean('checada')->default(0);
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
        Schema::dropIfExists('solicitacaocontato');
    }
}
