<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\User;
use PHPMailer\PHPMailer;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Solicitacaocontato;
use App\Models\Historicousers;
use SebastianBergmann\Environment\Console;
use phpDocumentor\Reflection\DocBlock\Tags\Uses;

class CadastroController extends Controller
{


    public function recuperarsenha(Request $request)
    {
        $email = $request->email;
        $user = DB::table('users')->where(['email' => $email])->first();
        if ($user) {
            $ativaCod = Str::random(10);
            User::where('email', $email)->update(['validakey' =>  $ativaCod]);

            $linkAtivacao = "www.mysquare.com.br/redefinir/" . $ativaCod;

            $assunto = "MySquare - Redefinição de senha";
            $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
            $full_name = "rodolfo diego";
            $message  = "<html><body>";
            $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
            $message .= "<tr><td>";
            $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
            $message .= "<thead style='border-radius:20px;'>
                                <tr height='80' style='border-radius:20px;'>
                                <th colspan='4' style=' border-radius:20px; border-bottom:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#ffffff; background-color:#3f9268; font-size:34px;' >MySquare</th>
                                </tr>
                                </thead>";
            $message .= "<tbody>
                                <tr>
                                <td colspan='4' style='padding:15px;'>
                                <p style='font-size:25px;'>Redefinição de senha:</p>

                                <p style='font-size:20px;'>Olá " . $request->email . ". Uma redefinição de senha foi solicitada para a sua conta</p>
                                <div>
                                <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>Para redefinir sua senha <a href='" . $linkAtivacao . "' color='blue'>clique aqui</a>.</p>
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

            $retorno = $this->enviaEmail($email, $assunto,  $message);

            $this->registronohistorico('Recuperação de Senha, enviado para o email:'.$email ,$user->id);


            return response()->json(['detalhe' => $retorno]);
        } else {
            return response()->json(['detalhe' => 'O email não existe!']);
        }
    }

    public function existeemail(Request $request)
    {
        $user =   DB::table('users')->where('email', $request->email)->first();
        if ($user) {
            return response()->json(['detalhe' => 'usado']);
        } else {
            return response()->json(['detalhe' => 'livre']);
        }
    }

    public function enviaremailconfirmacao(Request $request)
    {
        $user = DB::table('users')->where('email', $request->email)->first();

        $ativacod = $user->validakey;

        $linkAtivacao = "http://www.mysquare.com.br/validar/" . $ativacod;
        $assunto = "MySquare - Validação de conta";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $full_name = "rodolfo diego";
        $message  = "<html><body>";
        $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
        $message .= "<tr><td>";
        $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
        $message .= "<thead style='border-radius:20px;'>
                            <tr height='80' style='border-radius:20px;'>
                            <th colspan='4' style=' border-radius:20px; color:#ffffff; background-color:#3f9268; border-bottom:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; font-size:34px;' >MySquare</th>
                            </tr>
                            </thead>";
        $message .= "<tbody>
                            <tr>
                            <td colspan='4' style='padding:15px;'>
                            <p style='font-size:25px;'>Confirmação de e-mail:</p>

                            <p style='font-size:20px;'>Olá " . $request->email . ". Muito obrigado por contar com a Mysquare para impulsionar o seu negócio.</p>
                            <div>
                            <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>Para liberar a sua conta com o seu perfil <a href='" . $linkAtivacao . "' color='blue'>clique aqui</a>.</p>
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
        $this->enviaEmail($request->email, $assunto,  $message);

        $this->registronohistorico('Validação da conta do usuário',$user->id);


        return response()->json(['detalhe' => 'ok']);
    }

    public function cadastraruserchildren(Request $request)
    {

        $userparent = User::where('id', $request->idParent)->first();

        if($request->editarUser){
            $user  = User::where('id', $request->idUser)->first();
            $user->update(array(
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'name' => $request->name,
                'telefone' => $request->telefone
            ));
        }else{

            if (User::where('email', $request->email)->first()) {
                return response()->json(['detalhe' => 'usado', 'msg' => 'O email já existe!']);
            }

            $user = new User([
                'status' => '3',
                'validakey' => '',
                'nomeempresa' => $userparent->nomeempresa,
                'cnpj'=> $userparent->cnpj,
                'name' => $request->name,
                'cpf' => $request->cpf,
                'isadmin' => 0,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'tipoconta' => $request->tipoconta,
                'tipopessoa' => $request->tipopessoa,
                'id_parent' => $request->idParent,
                'telefone' => $request->telefone
            ]);
            $user->save();
        }


        $linkAtivacao = "http://www.mysquare.com.br/acessar";
        $assunto = "MySquare - Convite";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $message  = "<html><body>";
        $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
        $message .= "<tr><td>";
        $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
        $message .= "<thead style='border-radius:20px;'>
                        <tr height='80' style='border-radius:20px;'>
                        <th colspan='4' style='border-radius:20px; border:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#ffffff; background-color:#3f9268; font-size:34px;' >MySquare</th>
                        </tr>
                        </thead>";
        $message .= "<tbody>
                        <tr>
                        <td colspan='4' style='padding:15px;'>
                        <p style='font-size:25px;'>Convite para você:</p>
                        <p style='font-size:20px;'>Olá " . $request->email . ". Você está sendo convidado pela empresa <b>" . $userparent->nomeempresa . "</b> para usar a Mysquare.</p>
                        <div>
                        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>Faça login com o email e senha informados no momento do cadastro <a href='" . $linkAtivacao . "' color='blue'>clicando aqui</a>.</p>
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

        $retorno = $this->enviaEmail($request->email, $assunto,  $message);

        $this->registronohistorico('O usuário '.$user->name.' foi convidado pela empresa: '. $userparent->nomeempresa .', de email:'. $userparent->email.' para usar a ferramenta Mysquare',$user->id);

        return response()->json(['detalhe' => $retorno]);

    }

    public function cadastrar(Request $request)
    {
        if (User::where('email', $request->email)->first()) {
            return response()->json(['detalhe' => 'usado', 'msg' => 'O email já existe!']);
        }

        if ((User::where('cnpj', $request->cnpj)->first()) && ($request->tipopessoa == 'juridica')) {
            return response()->json(['detalhe' => 'usado', 'msg' => 'O CNPJ já foi cadastrado! Entre em contato com o suporte.']);
        }

        $ativacod = Str::random(10);

        $user = new User([
            'cnpj' => '',
            'cpf' => '',
            'nomeempresa' => '',
            'nome' => '',
            'isadmin' => 0,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'tipoconta' => $request->tipoconta,
            'tipopessoa' => $request->tipopessoa,
            'validakey' => $ativacod,
            'id_parent' => $request->idParent,
            'telefone' => $request->telefone
        ]);

        if ($request->tipopessoa == 'juridica') {
            $user['nomeempresa'] = $request->nomeempresa;
            $user->cnpj = $request->cnpj;
        } else {
            $user->name = $request->name;
            $user->cpf = $request->cpf;
        }
        $user->save();

        $linkAtivacao = "http://www.mysquare.com.br/validar/" . $ativacod;
        $assunto = "MySquare - Validação de conta";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $full_name = "rodolfo diego";
        $message  = "<html><body>";
        $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
        $message .= "<tr><td>";
        $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
        $message .= "<thead style='border-radius:20px;'>
                        <tr height='80' style='border-radius:20px;'>
                        <th colspan='4' style=' border-radius:20px;  border:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#ffffff; background-color:#3f9268; font-size:34px;' >MySquare</th>
                        </tr>
                        </thead>";
        $message .= "<tbody>
                        <tr>
                        <td colspan='4' style='padding:15px;'>
                        <p style='font-size:25px;'>Confirmação de e-mail:</p>
                        <p style='font-size:20px;'>Olá " . $request->email . ". Muito obrigado por contar com a Mysquare para impulsionar o seu negócio.</p>
                        <div>
                        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>Para liberar a sua conta com o seu perfil <a href='" . $linkAtivacao . "' color='blue'>clique aqui</a>.</p>
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
        // $this->enviaEmail($request->email, $assunto,  $message);

        $this->registronohistorico('Primeiro cadastro do usuário. Validação da conta do usuário pelo email:'. $request->email,$user->id);


        $retorno = $this->enviaEmail($request->email, $assunto, $message);

        return response()->json(['detalhe' => $retorno]);
    }

    public function solicitacontato(Request $request)
    {
        $solicitacaocontato = new Solicitacaocontato();

        $solicitacaocontato->email = $request->email;
        $solicitacaocontato->telefone = $request->tel;
        $solicitacaocontato->mensagem = $request->mensagem;
        $solicitacaocontato->save();

        $assunto = "MySquare - Solicitação de Contato";
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
                        <p style='font-size:25px;'>Solicitação de Contato:</p>
                        <p style='font-size:20px;'>Olá " . $request->email . ". Recebemos sua menssagem:</p>

                        <div style='border: 1px solid; padding: .375rem .75rem; border-radius: .25rem; background-color: #f5f5f5;'>
                        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>" . $request->mensagem . "</p>
                        </div>

                        <p style='font-size:20px;'>Em breve a equipe MySquare entrará em contato!</p>

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


        $this->enviaEmail($request->email, $assunto, $message);

        $arquivo = null;
        $emailMysquare = "mysquare@mysquare.com.br";

        $linkCaixaEntrada = "http://www.mysquare.com.br/caixadeentrada";
        $assunto = "MySquare - Nova solicitação de Contato";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $arquivo = $arquivo . "<h2>Tem uma nova solicitação de contato:</h2>";
        $arquivo = $arquivo . "<h3>Email: " . $request->email . "</h3>";
        $arquivo = $arquivo . "<h3>Telefone: " . $request->tel . "</h3>";
        $arquivo = $arquivo . "<h3>Mensagem: " . $request->mensagem . "</h3><br> ";
        $arquivo = $arquivo . "&nbsp;<button><a href='" . $linkCaixaEntrada . "' color='blue'>Checar Solitações</a></button>.<br><br>Obrigado,<br>MySquare";

        $this->enviaEmail($emailMysquare, $assunto, $arquivo);

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

    public function registronohistorico($descricao, $iduser){
        $salvarnohistorico = new Historicousers;
        $salvarnohistorico->descricao = $descricao;
        $salvarnohistorico->id_user = $iduser;
        $salvarnohistorico->save();
    }
}
