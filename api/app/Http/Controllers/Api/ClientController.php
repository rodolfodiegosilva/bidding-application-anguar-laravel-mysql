<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Produtos;
use App\Models\Solicitacaocontato;
use App\Models\Orcamentos;
use App\Models\Docsproposta;
use App\Models\Propostas;

use PHPMailer\PHPMailer;
use Illuminate\Support\Facades\Mail;
use App\Mail\SolicitacaoContatoMail;
use App\Mail\SolicitacaoContatoMail2;
use App\Models\Categorias;
use App\Models\Orcamentocategorias;
use App\Models\Segmentos;
use App\Models\Estado;
use App\Models\Municipio;
use App\Models\User;
use App\Models\ImgProduto;
use App\Classes\Arquivo;

class ClientController extends Controller
{

    public function orcaservico(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
        }else{
            $iduser = auth()->user()->id;
        }

        $categorias = $request->categorias;

        $orcamento = new Orcamentos();

        $orcamento->id_client = $iduser;
        $orcamento->orcamento = 's';
        $orcamento->titulo = $request->titulo;
        $orcamento->descricao = $request->descricao;
        $orcamento->status = 'aberta';
        $orcamento->datainiciopublicacao = $request->datainiciopublicacao;
        $orcamento->datafimpublicacao = $request->datafimpublicacao;
        $orcamento->datafimentrega = $request->datafimentrega;
        $orcamento->temvisita = $request->temvisita['value'];

        if($request->temvisita['value']){
            $orcamento->datainiciovisita = $request->temvisita['datainicio'];
            $orcamento->datafimvisita = $request->temvisita['datafim'];
        }
        $orcamento->save();

        $categorias = $request->categorias;

        for ($i = 0; $i < count($categorias); $i++)
        {
            if($categorias[$i]['valida'] == false){
                $tablecategoria = new Categorias();
                $tablecategoria->nome = $categorias[$i]['nome'];
                $tablecategoria->grupo = 'grupo';
                $tablecategoria->valida = false;
                $tablecategoria->save();

                $tableorcacategoria = new Orcamentocategorias();
                $tableorcacategoria->user_id = $iduser;
                $tableorcacategoria->orcamento_id = $orcamento->id;
                $tableorcacategoria->categoria_id = $tablecategoria->id;
                $tableorcacategoria->save();

            }else if($categorias[$i]['valida']  == true){

                $tableorcacategoria = new Orcamentocategorias();
                $tableorcacategoria->user_id = $iduser;
                $tableorcacategoria->orcamento_id = $orcamento->id;
                $tableorcacategoria->categoria_id = $categorias[$i]['id'];
                $tableorcacategoria->save();
            }
        }

        return response()->json(['detalhe' => 'ok']);
    }

    public function orcaproduto(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
        }else{
            $iduser = auth()->user()->id;
        }

        $orcamento = new Orcamentos();

        $orcamento->id_client = $iduser;
        $orcamento->orcamento = 'p';
        $orcamento->titulo = $request->titulo;
        $orcamento->descricao = $request->descricao;
        $orcamento->status = 'aberta';
        $orcamento->temvisita = $request->temvisita;
        $orcamento->datainiciopublicacao = $request->datainiciopublicacao;
        $orcamento->datafimpublicacao = $request->datafimpublicacao;
        $orcamento->datafimentrega = $request->datafimentrega;
        $orcamento->save();

        $categorias = $request->categorias;

        for ($i = 0; $i < count($categorias); $i++)
        {
            if($categorias[$i]['valida'] == false){
                $tablecategoria = new Categorias();
                $tablecategoria->nome = $categorias[$i]['nome'];
                $tablecategoria->grupo = 'grupo';
                $tablecategoria->valida = false;
                $tablecategoria->save();

                $tableorcacategoria = new Orcamentocategorias();
                $tableorcacategoria->user_id = $iduser;
                $tableorcacategoria->orcamento_id = $orcamento->id;
                $tableorcacategoria->categoria_id = $tablecategoria->id;
                $tableorcacategoria->save();

            }else if($categorias[$i]['valida']  == true){

                $tableorcacategoria = new Orcamentocategorias();
                $tableorcacategoria->user_id = $iduser;
                $tableorcacategoria->orcamento_id = $orcamento->id;
                $tableorcacategoria->categoria_id = $categorias[$i]['id'];
                $tableorcacategoria->save();
            }
        }

        $produtos = $request->produtos;

        for ($i = 0; $i < count($produtos); $i++) {
            $produto = new Produtos();
            $produto->id_orcamento = $orcamento->id;
            $produto->partnumber = $produtos[$i]['mpartnumber'];
            $produto->ncm = $produtos[$i]['mncm'];
            $produto->descricao = $produtos[$i]['mdescricao'];
            $produto->fabricante = $produtos[$i]['mfabricante'];
            $produto->qtd = $produtos[$i]['mqtd'];
            $produto->save();

            $imgProfile = new ImgProduto();
            $imgProfile->id_produto = $produto->id;
            $imgProfile->name = 'img-Produto';
            $fileName = 'imgproduto'.$orcamento->id.$produto->id.'dat';
            $imgProfile->namestore = $fileName;
            Arquivo::Salvar($produtos[$i]['mimagem'], 'imgproduto', $fileName);
            $imgProfile->save();

        }

        return response()->json(['detalhe' => 'ok','requeste' => $request->all()]);
    }

    public function mypedidoscliente()
    {
        $user = auth()->user();

        if($user->id_parent){

            $userparent =  User::where('id',$user->id_parent)->first();
            $orcamentos  = $userparent ->orcamentos()->get();

            foreach( $orcamentos as $orcamento){
                $orcamento->categorias = $orcamento->categorias()->get();
            }

            return response()->json(['user' => $user, 'listapedidos' => $orcamentos ]);
        }else{
            $orcamentos  = $user->orcamentos()->get();

            foreach( $orcamentos as $orcamento){
                $orcamento->categorias = $orcamento->categorias()->get();
            }
            return response()->json(['user' => $user, 'listapedidos' => $orcamentos ]);
        }
    }

    public function pegacategorias()
    {

        $categorias =  DB::table('categorias')->get();

        return response()->json(['lista' => $categorias]);
    }


    public function pegacategoriasbylike(Request $request)
    {
        $palavra = '%' . $request->palavra . '%';
        $categorias = Categorias::where('nome', 'like', $palavra)->limit(8)
            ->where(['valida' => true])->get();

        return response()->json(['lista' => $categorias]);
    }
    public function pegasegmentos() {

        $seguimentos = Segmentos::where(['valida' => true])->get();

        return response()->json(['lista' => $seguimentos]);
    }

    public function pegaestados() {

        $estados = Estado::get();

        return response()->json(['lista' => $estados]);
    }

    public function pegamunicipios(Request $request) {

        $estado = Estado::where(['Nome' => $request->estado])->first();
        $municipios = $estado->municipios()->get();
        return response()->json(['lista' => $municipios]);
    }

    public function mypropostacliente(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $iduser = $user->id_parent;
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $iduser= auth()->user()->id;
        }

        $idorcamento = $request->myId;
        $orcamento = Orcamentos::where('id',$idorcamento)->first();
        $propostas = $orcamento->propostas()->get();

        foreach($propostas as $proposta){

            $proposta->docproposta = $proposta->docsproposta()->first();
            if($proposta->docproposta){
                $docnamestore = $proposta->docproposta->namestore;
                $base64 = Arquivo::abrir('docspropostas',$docnamestore);
                $proposta->docproposta ['base64'] = $base64;
            }

            $proposta->fornecedor = $proposta->usuario()->first();
            $proposta->nomeempresa = $proposta->fornecedor->nomeempresa;

            $proposta->propostasprod = $proposta->propostasprod()->get();
            foreach($proposta->propostasprod as $proposta){
                $proposta->produto = $proposta->produto()->first();
                $imgproduto = $proposta->produto->imgproduto()->first();

                if($imgproduto){
                    $namestoreimproduto = $imgproduto->namestore;
                    $base64 = Arquivo::abrir('imgproduto',$namestoreimproduto);
                    $proposta->produto['base64'] = $base64;
                }
            }

        }

        $orcamento->categorias = $orcamento->categorias()->get();
        return response()->json(['lista' => $propostas,'cotacao'=>$orcamento]);
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
    public function getproposta(Request $request)
    {
        $proposta = Propostas::where('id', $request->id)->first();
        $proposta->docproposta = $proposta->docsproposta()->first();
        $proposta->propostasprod = $proposta->propostasprod()->get();

        return response()->json(['detalhe' => 'ok', 'proposta' => $proposta]);
    }
    public function suspendercotacao(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $user = auth()->user();
        }

        Orcamentos::where(['id' => $request->id, 'id_client' => $user->id])->update(array('status' => 'suspensa'));

        return response()->json(['detalhe' => 'ok']);
    }
    public function reabrircotacao(Request $request)
    {
        $user = auth()->user();

        if($user->id_parent){
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $user = auth()->user();
        }

        Orcamentos::where(['id' => $request->id, 'id_client' => $user->id])->update(array('status' => 'aberta','datainiciopublicacao' => $request->datainicio,'datafimpublicacao' => $request->datafim,'datafimentrega' => $request->dataentrega));

        return response()->json(['detalhe' => 'ok']);
    }

    public function encerrarcotacao(Request $request) {

        $user = auth()->user();

        if($user->id_parent){
            $user = User::where('id',$user->id_parent)->first();
        }else{
            $user = auth()->user();
        }

        Orcamentos::where('id',$request->id)->update(array('status' => 'encerrada'));
        $orcamento = Orcamentos::where('id',$request->id)->first();
        $propostas = $orcamento->propostas()->get();

        foreach($propostas as $proposta){
            $userproposta = $proposta->usuario()->first();
            $email = $userproposta->email;
            $nome = $userproposta->nomeempresa;
            $msg = $request->msg;

            $assunto = "MySquare - Encerramento de Cotação";
            $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
            $message  = "<html><body>";
            $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
            $message .= "<tr><td>";
            $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
            $message .= "<thead style=' border-radius:20px;'>
                            <tr height='80' style='border-radius:20px;'>
                            <th colspan='4' style=' border-radius:20px; border:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#ffffff; background-color:#3f9268; font-size:34px;' >MySquare</th>
                            </tr>
                            </thead>";
            $message .= "<tbody>
                            <tr>
                            <td colspan='4' style='padding:15px;'>
                            <p style='font-size:25px;'>Encerramento de Cotação:</p>
                            <p style='font-size:20px;'>Olá, <b> " . $nome . "</b>. Passando pra avisar que a cotação <b>".$orcamento->titulo."</b> foi encerrada.</p>

                            <p style='font-size:20px;'>O cliente <b> ".$user->nomeempresa."</b> deixou a seguinte mensagem:</p>

                            <div style='border: 1px solid; padding: .375rem .75rem; border-radius: .25rem; background-color: #f5f5f5;'>
                            <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>" . $msg  . "</p>
                            </div>

                            </td>
                            </tr>
                            <tr height='80'>
                            <td colspan='4' align='center' style='color:#ffffff; background-color:#3f9268;font-size:15px;'>
                            <label> <p class='h6'>©Copyright Instituto Xavier.</p> </label>
                            </td>
                            </tr>
                            </tbody>";

            $message .= "</table>";
            $message .= "</td></tr>";
            $message .= "</table>";
            $message .= "</body></html>";

            $this->enviaEmail($email, $assunto, $message);

        }

        return response()->json(['detalhe' => 'ok']);
    }

    public function enviaEmail($toEmail, $titulo, $corpo)
    {
        //Variáveis
        $emailMysquare = "mysquare@mysquare.com.br";
        $passwordMysquare = "Sup3rM@square";
        try {
            $mail             = new PHPMailer\PHPMailer(); // create a n
            $mail->CharSet = 'UTF-8';
            $mail->IsSMTP(); // enable SMTP
            $mail->SMTPAuth = true; // authentication enabled
            $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
            $mail->Host = "ns24.hostgator.com.br";
            $mail->Port = 465; // or 587
            $mail->IsHTML(true);
            $mail->Username = $emailMysquare;
            $mail->Password = $passwordMysquare;
            $mail->SetFrom($emailMysquare);
            $mail->Subject = $titulo;
            $mail->Body = $corpo;
            $mail->AddAddress($toEmail);

            if (!$mail->Send()) {
                return "Mailer Error: " . $mail->ErrorInfo;
            } else {
                return "ok";
            }
        } catch (Exception $e) {
            return "Mailer Error: " + $e->getMessage();
        }
    }

}
