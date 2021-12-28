<?php

namespace App\Http\Controllers\Api;

use App\Models\Orcamentos;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class OrcamentoController extends Controller
{
    public function show(Orcamentos $orcamentos)
    {
        if ($orcamentos) {
            echo "<h1>Dados do orcamento</h1>";
            echo "<h1>{ $orcamentos->titulo }</h1>";
        }
        $user = $orcamentos->usuario->first();

        if ($user) {
            echo "<h1>Dados do Usuario</h1>";
            echo "<h1>{ $user->email }</h1>";
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
