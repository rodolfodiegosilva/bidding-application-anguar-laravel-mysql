<?php

namespace App\Http\Controllers\Api;
use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer;
use App\Http\Controllers\Controller;
use App\Models\Docsclientes;
use App\Classes\Arquivo;
use App\Models\Historicousers;

class AdminController extends Controller
{

    protected function getcadastros(Request $request)
    {
        $status = $request->status;

        $userPaginate = User::whereIn('status', $status)
            ->where('tipopessoa', 'juridica')
            ->with('categorias')
            ->paginate(10);
        return response()->json(['paginate' => $userPaginate, 'detalhe' => 'ok', 'query' => $request->all()]);
    }

    protected function getUserByCampo(Request $request)
    {
        $campo = $request->campo;
        $valor = $request->valor;

        $userPaginate = User::orWhere($campo, 'like', '%' . $valor . '%')
            ->with('categorias')
            ->paginate(10);
        //   $userPaginate->query = $request->all();

        return response()->json(['paginate' => $userPaginate, 'detalhe' => 'ok']);
        # code...
    }

    private function getdocs($documentos) // ler binarios
    {
        for ($i = 0; $i < count($documentos); $i++) {
            $base64 = Arquivo::abrir($documentos[$i]->namestore);
            if ($base64) {
                $documentos[$i]->base64 = $base64;
            }
        }
        return $documentos;
    }

    protected function getdocsclient(Request $request)
    {
        $base64 = Arquivo::abrir('docsclientes',$request->namestore);
        if ($base64) {
            return response()->json(['detalhe' => 'ok', 'doc' => $base64]);
        } else {
            return response()->json(['detalhe' => 'null', 'msg' => 'Arquivo não encontrado!']);
        }
    }

    protected function getUserById(Request $request)
    {
        $userid = $request->id;

        $user = User::where('id', $userid)->first();
        $user->historico = $user->historico()->get();
        $user->docsuser = $user->documentos()->get();


        if ($user) {
            if ($user->tipoconta == 'client') {
                $usersegmento = $user->usersegmento()->first();
                $user->segmento = $usersegmento->segmento()->first();

                return response()->json(['users' => $user, 'detalhe' => 'ok']);
            } else {
                $user->categorias = $user->categorias()->get();
                return response()->json(['users' => $user,'detalhe' => 'ok']);
            }
        } else {
            return response()->json(['users' => $user, 'detalhe' => 'null']);
        }
    }

    protected function setstatus(Request $request)
    {
        $useradmin = auth()->user();
        $user = User::where('email', '=', $request->email)->first();

        if (!$user) {
            return response()->json(['detalhe' => 'Usuário não encontrado!']);
        }

        $user->status = $request->status;
        $user->update();

        $this->registronohistorico('O status do usuário foi trocado para '.$request->status .', pelo Admin:  '. $useradmin->name.', de email: '.$useradmin->email, $user->id);

        return response()->json(['detalhe' => 'ok']);
    }
    protected function bloqueiconta(Request $request)
    {
        $useradmin = auth()->user();
        $user = User::where('email', '=', $request->email)->first();
        if (!$user) {
            return response()->json(['detalhe' => 'Usuário não encontrado!']);
        }
        // implementar motivo e desparar email
        $user->status = '5';
        $user->update();


        $assunto = "MySquare - Notificação";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $message  = "<html><body>";
        $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
        $message .= "<tr><td>";
        $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
        $message .= "<thead style=' border-radius:20px;'>
                        <tr height='80' style='border-radius:20px;'>
                        <th colspan='4' style=' border-radius:20px; background-color:#f5f5f5; border:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#333; font-size:34px;' >MySquare</th>
                        </tr>
                        </thead>";
        $message .= "<tbody>
                        <tr>
                        <td colspan='4' style='padding:15px;'>
                        <p style='font-size:25px;'>Notificação sobre sua conta:</p>
                        <p style='font-size:20px;'>Olá " . $request->email . ". Infeslimente nós optamos por bloquear sua conta, pelo seguinte motivo:</p>

                        <div style='border: 1px solid; padding: .375rem .75rem; border-radius: .25rem; background-color: #f5f5f5;'>
                        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>" .$request->msg. "</p>
                        </div>

                        <p style='font-size:20px;'>A equipe MySquare agradece!</p>

                        </td>
                        </tr>
                        <hr>
                        <tr height='80'>
                        <td colspan='4' align='center' style='background-color:#f5f5f5;font-size:15px;'>
                        <label> <p class='h6'>©Copyright Instituto Xavier.</p> </label>
                        </td>
                        </tr>
                        </tbody>";

        $message .= "</table>";
        $message .= "</td></tr>";
        $message .= "</table>";
        $message .= "</body></html>";

        $retorno = $this->enviaEmail($request->email, "Suport MySquare", $message);

        $this->registronohistorico('O usuário foi bloqueado pelo Admin: '. $useradmin->name.', de email: '.$useradmin->email.'. Motivo do bloqueio: '. $request->msg, $user->id);

        return response()->json(['detalhe' => $retorno]);
    }

    protected function notificarConta(Request $request)
    {
        $useradmin = auth()->user();
        $user = User::where('email', '=', $request->email)->first();
        if (!$user) {
            return response()->json(['detalhe' => 'Usuário não encontrado!']);
        }
        // implementar motivo e desparar email
        $user->status = '1';
        $user->update();

        $assunto = "MySquare - Notificação";
        $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
        $message  = "<html><body>";
        $message .= "<table width='100%' bgcolor='#e0e0e0' cellpadding='0' cellspacing='0' border='0'>";
        $message .= "<tr><td>";
        $message .= "<table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#fff; font-family:Verdana, Geneva, sans-serif;'>";
        $message .= "<thead style=' border-radius:20px;'>
                        <tr height='80' style='border-radius:20px;'>
                        <th colspan='4' style=' border-radius:20px; background-color:#f5f5f5; border:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#333; font-size:34px;' >MySquare</th>
                        </tr>
                        </thead>";
        $message .= "<tbody>
                        <tr>
                        <td colspan='4' style='padding:15px;'>
                        <p style='font-size:25px;'>Notificação sobre sua conta:</p>
                        <p style='font-size:20px;'>Olá " . $request->email . ". Precisamos que você verfique algumas coisas em relação a sua conta:</p>

                        <div style='border: 1px solid; padding: .375rem .75rem; border-radius: .25rem; background-color: #f5f5f5;'>
                        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;'>" .$request->msg. "</p>
                        </div>

                        <p style='font-size:20px;'>A equipe MySquare agradece!</p>

                        </td>
                        </tr>
                        <hr>
                        <tr height='80'>
                        <td colspan='4' align='center' style='background-color:#f5f5f5;font-size:15px;'>
                        <label> <p class='h6'>©Copyright Instituto Xavier.</p> </label>
                        </td>
                        </tr>
                        </tbody>";

        $message .= "</table>";
        $message .= "</td></tr>";
        $message .= "</table>";
        $message .= "</body></html>";

        $retorno = $this->enviaEmail($request->email, "Suport MySquare", $message);

        $this->registronohistorico('O status do usuário foi alterado para Checado e recebeu uma notificação do Admin: '. $useradmin->name.', de email: '.$useradmin->email.'. Notificação: '. $request->msg, $user->id);


        return response()->json(['detalhe' => $retorno]);
    }

    public function enviaEmail($toEmail, $titulo, $corpo)
    {
        //Variáveis
        $emailMysquare = "mysquare@mysquare.com.br";
        $passwordMysquare = "Sup3rM@square";
        try {
            $mail             = new PHPMailer\PHPMailer(); // create a n
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

    protected function mudastatus(Request $request)
    {
        $useradmin = auth()->user();
        $user = User::where('email', '=', $request->email)->first();
        if (!$user) {
            return response()->json(['detalhe' => 'Usuário não encontrado!']);
        }
        if ($request->novostatus == 'Criado') {
            $user->status = '0';
            $user->update();
        } else if ($request->novostatus == 'Checado') {
            $user->status = '1';
            $user->update();
        } else if ($request->novostatus == 'Aguardando') {
            $user->status = '2';
            $user->update();
        } else if ($request->novostatus == 'Aprovado') {
            $user->status = '3';
            $user->update();
        } else if ($request->novostatus == 'Reprovado') {
            $user->status = '4';
            $user->update();
        } else if ($request->novostatus == 'Bloqueado') {
            $user->status = '5';
            $user->update();
        }

        $this->registronohistorico('O status do usuário foi trocado para '.$request->novostatus .', pelo Admin:  '. $useradmin->name.', de email: '.$useradmin->email, $user->id);

        return response()->json(['detalhe' => 'ok']);
    }

    public function registronohistorico($descricao, $iduser){
        $salvarnohistorico = new Historicousers;
        $salvarnohistorico->descricao = $descricao;
        $salvarnohistorico->id_user = $iduser;
        $salvarnohistorico->save();
    }
}
