<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocsclientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('docsclientes', function (Blueprint $table) {
            $table->id();
            //$table->integer('id_client');
            $table->unsignedBigInteger('id_client')->unsigned();
            $table->foreign('id_client')->references('id')->on('users')->onDelete('cascade');
            $table->string('name',100);
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
        Schema::dropIfExists('docsclientes');
    }
}
