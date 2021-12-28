<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Propostaprod;
use App\Models\Propostas;
use App\Models\Orcamentos;
use App\Models\Orcaprodutos;
use App\Models\User;
use App\Models\Docsproposta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Classes\Arquivo;

class FornecedorController extends Controller
{
    public function propostaservico(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
        }else{
            $iduser = auth()->user()->id;
        }

        $proposta = new Propostas();

        $proposta->id_fornecedor = $iduser;
        $proposta->id_orcamento = $request->orcaid;
        $proposta->proposta = $request->descricaoproposta;
        $proposta->dataentrega = $request->dataentrega;
        $proposta->podeeditar = false;
        $proposta->valorservico = $request->valorservico;
        $proposta->save();

        $docproposta = new Docsproposta();

        $docproposta->id_proposta = $proposta->id;
        $docproposta->name = $request->arquivo[0]['nome'];
        $base64 = $request->arquivo[0]['base64'];
        $fileName ='proposta'.$iduser.$proposta->id.'dat';
        $docproposta->namestore = $fileName;
        Arquivo::Salvar($base64, 'docspropostas', $fileName);
        $docproposta->save();



        return response()->json(['detalhe' => 'ok']);
    }

    public function propostaprod(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
        }else{
            $iduser = auth()->user()->id;
        }


        $proposta = new Propostas();
        $valortotal = 0;

        $proposta->id_fornecedor = $iduser;
        $proposta->id_orcamento = $request->orcaid;
        $proposta->dataentrega = $request->dataentrega;
        $proposta->podeeditar = false;
        $proposta->proposta = $request->descricaoproposta;
        $proposta->save();

        $docproposta = new Docsproposta();

        $docproposta->id_proposta = $proposta->id;
        $docproposta->name = $request->arquivo[0]['nome'];
        $base64 = $request->arquivo[0]['base64'];
        $fileName ='proposta'.$iduser.$proposta->id.'dat';
        $docproposta->namestore = $fileName;
        Arquivo::Salvar($base64, 'docspropostas', $fileName);
        $docproposta->save();

        $produtos = $request->produtos;

        for ($i = 0; $i < count($produtos); $i++) {
            $propostaprod = new Propostaprod();

            $propostaprod->id_fornecedor = $iduser;
            $propostaprod->id_proposta = $proposta->id;
            $propostaprod->id_orcaproduto = $produtos[$i]['id'];
            $propostaprod->valorunitario = $produtos[$i]['valorunitario'];
            $propostaprod->valortotal = $produtos[$i]['valortotal'];
            $valortotal = $valortotal + $produtos[$i]['valortotal'];
            $propostaprod->dataentrega = $produtos[$i]['dataentregaprod'];
            $propostaprod->save();
        }
        DB::table('propostas')->where(array('id' => $proposta->id ))->update(array('valorservico' => $valortotal));


        return response()->json(['detalhe'=>'ok']);
    }

    public function pedidoscliente()
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $iduser= auth()->user()->id;
        }


        $catsforn = $user->categorias()->get();
        $allorcamentos  = Orcamentos::get();
        $orcamentosresponse = array();
        $i=0;

        foreach( $allorcamentos as $orcamento){
            $orcamento->categorias = $orcamento->categorias()->get();
            $orcamento->proposta = $orcamento->propostas()->where('id_fornecedor',$iduser)->first();
            if($orcamento->proposta ){
                $orcamento->proposta->docproposta = Docsproposta::where('id_proposta',$orcamento->proposta->id)->first();
            }

        }

        foreach($allorcamentos as $orcamentos){
            $deumactch = false;
            foreach($orcamentos->categorias as $categoria){
                foreach($catsforn as $catforn){
                    if($catforn->nome == $categoria->nome){
                       $deumactch = true;
                        $orcamentosresponse[$i] = $orcamentos;
                        $i = $i + 1;
                       break;
                    }
                }
                if($deumactch){break;}
            }
        }

        return response()->json(['detalhe'=>'ok','lista' => $orcamentosresponse]);
    }

    public function getprodutosorcamento(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $iduser= auth()->user()->id;
        }

        //$iduser = $this->verifcarId(); // REFATORAR

        $idorcamento = $request->myId;

        $orcamento = Orcamentos::where('id',$idorcamento)->first();
        $produtos = $orcamento->produtos()->get();

        foreach($produtos as $produto){
            $produto->imgproduto = $produto->imgproduto()->first();

            $imgnamestore = $produto->imgproduto->namestore;
            $base64 = Arquivo::abrir('imgproduto',$imgnamestore);
            $produto->imgproduto['base64'] = $base64;

            $produto->proposta = $produto->propostasprod()->where('id_fornecedor',$iduser )->first();

        }

        return response()->json(['detalhe'=>'ok','lista' =>$produtos]);
    }

    public function excluirproposta(Request $request)
    {
         $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $iduser= auth()->user()->id;
        }

        $idproposta = $request->myId;

        DB::table('propostas')->where(['id'=> $idproposta, 'id_fornecedor' => $iduser])->delete();
        DB::table('propostaprod')->where(['id_proposta'=> $idproposta, 'id_fornecedor' => $iduser])->delete();

        return response()->json(['detalhe'=>'ok']);
    }

    public function atualizarproposta(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $iduser= auth()->user()->id;
        }

        $idproposta = $request->propoid;

        DB::table('propostas')
            ->where(['id'=> $idproposta, 'id_fornecedor' => $iduser])
            ->update(array('proposta' => $request->descricaoproposta, 'dataentrega' => $request->dataentrega));

        $produtos = $request->produtos;

        if($produtos){
            for ($i = 0; $i < count($produtos); $i++)
            {
                DB::table('propostaprod')->where(['id'=> $produtos[$i]['proprodid'], 'id_fornecedor' => $iduser])
                    ->update(array('valorunitario' => $produtos[$i]['valorunitario'],'valortotal' => $produtos[$i]['valortotal'], 'dataentrega' =>$produtos[$i]['dataentregaprod']));
            }
        }

         return response()->json(['detalhe'=>'ok']);
    }
    public function getdocproposta(Request $request)
    {
        $base64 = Arquivo::abrir('docspropostas',$request->namestore);
        if ($base64) {
            return response()->json(['detalhe' => 'ok', 'doc' => $base64]);
        } else {
            return response()->json(['detalhe' => 'null', 'msg' => 'Arquivo não encontrado!']);
        }
    }

    public function  verifcarId(){

        $user = auth()->user();

        if($user->id_parent){
           return  $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            return auth()->user()->id;
        }

    }
}
