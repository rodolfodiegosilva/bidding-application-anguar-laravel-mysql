<?php

use App\Http\Controllers\OrcamentoController;
use App\Models\Orcamentos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('cadastrar', 'Api\\CadastroController@cadastrar');
Route::post('existeemail', 'Api\\CadastroController@existeemail');
Route::post('enviaremailconfirmacao', 'Api\\CadastroController@enviaremailconfirmacao');

Route::get('/orcamento/{orcamentos}', 'Api\\OrcamentoController@show');
Route::post('updateacc', 'Api\\AuthController@updateacc');
Route::post('redefinesenha', 'Api\\AuthController@redefinesenha');
Route::post('solicitacontato', 'Api\\CadastroController@solicitacontato');

Route::post('pegacategoriasbylike', 'Api\\ClientController@pegacategoriasbylike');
Route::get('pegasegmentos', 'Api\\ClientController@pegasegmentos');
Route::get('pegaestados', 'Api\\ClientController@pegaestados');
Route::post('pegamunicipios', 'Api\\ClientController@pegamunicipios');
Route::post('login', 'Api\\AuthController@login');


Route::post('recuperarsenha', 'Api\\CadastroController@recuperarsenha');

Route::group([
    'middleware' => 'apiJwt',
], function () {
    // conta_bemvindos
    Route::post('getmydocbynome', 'Api\AuthController@getmydocbynome');

    Route::post('login', 'Api\AuthController@login');
    Route::get('reload', 'Api\\AuthController@reload');
    Route::post('refresh', 'Api\\AuthController@refresh');
    Route::post('temcodigo', 'Api\\AuthController@temcodigo');
    Route::post('validaconta', 'Api\AuthController@validaconta');
    Route::post('alterasenha', 'Api\\AuthController@alterasenha');
    Route::post('updatebemvindo', 'Api\\AuthController@updatebemvindo');
    Route::get('meucadastro', 'Api\AuthController@meucadastro');
    Route::get('me', 'Api\\AuthController@me');
    Route::get('getprofile', 'Api\\AuthController@getprofile');
    Route::get('getusers', 'Api\\AuthController@getusers');
    Route::post('excluiruser', 'Api\\AuthController@excluiruser');
    Route::post('bloquearuser', 'Api\\AuthController@bloquearuser');
    Route::post('desbloquearuser', 'Api\\AuthController@desbloquearuser');
    Route::get('logout', 'Api\\AuthController@logout');
    Route::post('cadastraruserchildren', 'Api\\CadastroController@cadastraruserchildren');

    Route::post('orcaservico', 'Api\\ClientController@orcaservico');
    Route::post('orcaproduto', 'Api\\ClientController@orcaproduto');
    Route::get('mypedidoscliente', 'Api\\ClientController@mypedidoscliente');
    Route::post('mypropostacliente', 'Api\\ClientController@mypropostacliente');
    Route::post('encerrarcotacao', 'Api\\ClientController@encerrarcotacao');
    Route::get('pegacategorias', 'Api\\ClientController@pegacategorias');
    Route::post('getproposta', 'Api\\ClientController@getproposta');
    Route::post('suspendercotacao', 'Api\\ClientController@suspendercotacao');
    Route::post('reabrircotacao', 'Api\\ClientController@reabrircotacao');

    Route::post('proposta', 'Api\\FornecedorController@proposta');
    Route::post('getdocproposta', 'Api\\FornecedorController@getdocproposta');
    Route::get('pedidoscliente', 'Api\\FornecedorController@pedidoscliente');
    Route::post('getprodutosorcamento', 'Api\\FornecedorController@getprodutosorcamento');
    Route::post('getdocpropostaforn', 'Api\\FornecedorController@getdocproposta');
    Route::post('propostaprod', 'Api\\FornecedorController@propostaprod');
    Route::post('propostaservico', 'Api\\FornecedorController@propostaservico');
    Route::get('pedidoscliente', 'Api\\FornecedorController@pedidoscliente');
    Route::post('atualizarproposta', 'Api\\FornecedorController@atualizarproposta');
    Route::post('produtoscliente', 'Api\\FornecedorController@produtoscliente');
    Route::post('excluirproposta', 'Api\\FornecedorController@excluirproposta');
});

/*
Rotina de Painel de aDministrador
*/
Route::group([
    'middleware' => ['apiJwt','admincheck'],
], function () {
    Route::post('setstatus', 'Api\\AdminController@setstatus');
    Route::post('getcadastros', 'Api\\AdminController@getcadastros');
    Route::post('getuserbycampo', 'Api\\AdminController@getUserByCampo');
    Route::post('getuserbyid', 'Api\\AdminController@getUserById');
    Route::post('getdocsclient', 'Api\\AdminController@getdocsclient');
    Route::post('bloqueiconta', 'Api\\AdminController@bloqueiconta');
    Route::post('notificarConta', 'Api\\AdminController@notificarConta');
    Route::post('mudastatus', 'Api\\AdminController@mudastatus');
});
