<?php

namespace App\Http\Controllers\Api;

//use Tymon\JWTAuth\JWTAuth;

use App\Classes\Arquivo;
use App\Models\User;
use App\Models\Segmentos;
use App\Models\Categorias;
use App\Models\Docsclientes;
use Illuminate\Http\Request;
use App\Models\Usersegmentos;
use App\Models\Usercategorias;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Perfil;
use App\Models\Historicousers;

class AuthController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // if(tentatativas >=3 && tempo > 5){return response()->json(['detalhe' => 'count_error'], 401);  }

        if (!$token = $this->guard()->attempt($credentials)) {
            return response()->json(['detalhe' => 'invalid_credentials'], 401);
        }

        $user = $this->guard()->user();

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function reload()
    {
        $user = auth()->user();
        return  response()->json(['detalhe' => 'ok', 'user' => $user], 401);
    }

    public function refresh()
    {
        try {
            $token  = $this->guard()->refresh();
        } catch (\Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                return response()->json(['status' => 'Token is Invalid'], 401);
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                // se expirado permite seguir para novo
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException) {
                return response()->json(['status' => 'The token has been blacklisted'], 401);
            } else {
                return response()->json(['status' => $e->getMessage()], 401);
            }
        }
        return response()->json(['token' => $token]);
    }

    public function logout()
    {
        $this->guard()->logout();

        return response()->json(['logout']);
    }

    public function me()
    {
        $user = $this->guard()->user();
        $token = $this->guard()->getToken()->get();
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function getprofile()
    {
        $user = $this->guard()->user();

        $fileName = Perfil::where('id_client',$user->id)->first();
        if ($fileName) {
            $base64 = Arquivo::abrir('imgprofile', $fileName->namestore);
        } else {
            $base64 = 'null';
        }
        $user['foto'] = $base64;

        return response()->json(['detalhe' => 'ok', 'user' => $user]);
    }

    public function getusers()
    {
        $user = $this->guard()->user();
        $users = User::where(array('id_parent' => $user->id))->get();

        return response()->json(['users' => $users]);
    }

    public function excluiruser(Request $request)
    {
        $userparent = $this->guard()->user();

        $userchildren = User::where(array('id' => $request->id, 'id_parent' => $userparent->id))->first();
        if ($userchildren) {
            $this->registronohistorico('O usuário '.$userchildren->name.' foi excluido pela empresa:'. $userparent->nomempresa.', de email:'. $userparent->nomempresa, $userchildren->id);
            $userchildren->delete();

            return response()->json(['detalhe' => 'ok']);
        }

        return response()->json(['msg' => 'Usuário não encontrado!']);
    }

    public function bloquearuser(Request $request)
    {
        $userparent = $this->guard()->user();

        $userchildren = User::where(array('id' => $request->id, 'id_parent' => $userparent->id))->first();
        if ($userchildren) {
            $userchildren->update(array('status' => '5'));
            $this->registronohistorico('O usuário '.$userchildren->name.' foi bloqueado pela empresa:'. $userparent->nomempresa.', de email:'. $userparent->nomempresa, $userchildren->id);
            return response()->json(['detalhe' => 'ok']);
        }

        return response()->json(['msg' => 'Usuário não encontrado!', 'userparent'=>$userparent]);
    }
    public function desbloquearuser(Request $request)
    {
        $userparent = $this->guard()->user();

        $userchildren = User::where(array('id' => $request->id, 'id_parent' => $userparent->id))->first();
        if ($userchildren) {
            $userchildren->update(array('status' => '3'));
            $this->registronohistorico('O usuário '.$userchildren->name.' foi desbloqueado pela empresa:'. $userparent->nomeempresa.', de email:'. $userparent->email, $userchildren->id);
            return response()->json(['detalhe' => 'ok','userparent'=>$userparent]);
        }

        return response()->json(['msg' => 'Usuário não encontrado!']);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    protected function validaconta(Request $request)
    {
        $user = User::where(array('validakey' => $request->validakey, 'status' => '0'))->first();

        if ($user) {
            User::where(array('validakey' => $request->validakey, 'status' => '0'))
                ->update(array('status' => '1', 'validakey' => ''));

            return response()->json(['detalhe' => 'ok']);
        } else {
            return response()->json(['detalhe' => 'null']);
        }
    }

    protected function redefinesenha(Request $request)
    {

        $chaveacao = substr($request->validakey, 0, 5);
        if ($chaveacao == 'ativa') {
            $cod = substr($request->validakey, 5);
            $user =   User::where('validakey', $cod)->first();

            if ($user) {
                $newpassword = bcrypt($request->password);

                User::where('validakey', $cod)->update(['password' => $newpassword, 'validakey' => '']);
                $this->registronohistorico('O usuário redefiniu sua senha.',$user->id);

                return response()->json(['detalhe' => 'ok']);
            } else {
                return response()->json(['detalhe' => 'null']);
            }
        } else {
            return response()->json(['detalhe' => 'null']);
        }
    }

    protected function temcodigo(Request $request)
    {
        $chaveacao = substr($request->validakey, 0, 5);

        if ($chaveacao == 'ativa') {
            $cod = substr($request->validakey, 5);
            $user =  User::where('validakey', $cod)->first();
            if ($user) {
                return response()->json(['detalhe' => 'ok']);
            } else {
                return response()->json(['detalhe' => 'null']);
            }
        } else {
            return response()->json(['detalhe' => 'invalido']);
        }
    }

    protected function alterasenha(Request $request)
    {
        $user = auth()->user();
        $id = $user->id;

        // $user = DB::table('users')->where(['password'=>$request->password,'email'=> $request->email])->first();
        // $password = auth()->user()->password;

        if ($user) {
            $newpassword = bcrypt($request->password);
            $user->update(['password' => $newpassword]);
            $this->registronohistorico('O usuário alterou sua senha.',$user->id);
            return response()->json(compact('user'));
        } else {
            return response()->json(['detalhe' => 'Senha ou usuário inválido!!']);
        }
    }

    protected function updateacc(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            $dado = $request->only(
                'name',
                'nomeempresa',
                'cpf',
                'cnpj',
                'endereco',
                'bairro',
                'telefone',
                'profissao',
                'cep',
                'pais',
                'cidade',
                'estado',
                'complemento',
                'categoria',
                'subcategoria',
                'apelido'
            );
            $user->update($dado);

            $base64 = $request->foto;
            if ($base64 != 'null') {

                $existeimgprofile = Perfil::where('id_client',$user->id)->first();

                if($existeimgprofile ){
                    $fileName = $existeimgprofile->namestore;
                    Arquivo::Deletar( 'imgprofile', $fileName );
                    $existeimgprofile->delete();
                }

                $imgProfile = new Perfil();
                $imgProfile->id_client = $user->id;
                $imgProfile->name = 'img-Profile';
                $fileName = 'profile' . $user->id . 'dat';
                $imgProfile->namestore = $fileName;
                Arquivo::Salvar($base64, 'imgprofile', $fileName);
                $imgProfile->save();
            }

            return response()->json(['detalhe' => 'updateok', 'user' => $user]);
        }

        return response()->json(['detalhe' => 'null']);
    }

    public function getmydocbynome(Request $request) // ler binarios
    {
        $mydocument = auth()->user()->documentos()->where(['namestore' =>  $request->fileName])->first();
        $base64 = Arquivo::abrir('docsclientes', $mydocument['namestore']);
        if ($base64) {
            return response()->json(['detalhe' => 'ok', 'doc' => $base64]);
        } else {
            return response()->json(['detalhe' => 'null', 'msg' => 'Arquivo não encontrado!']);
        }
    }

    public function meucadastro()
    {
        $user = auth()->user();
        if ($user) {
            $user->categorias = $user->categorias()->get();
            $user->documentos = $user->documentos()->get();
            return response()->json(['detalhe' => 'ok', 'user' => $user]);
        }
        return response()->json(['detalhe' => 'Usuário não encontrado!']);
    }

    protected function temFileNaLista($item, $lista)
    {
        for ($i = 0; $i < count($lista); $i++) {
            if ($lista[$i]['namestore'] == $item) {
                return true;
            }
        }
        return false;
    }

    protected function temCategoriaNaLista($item, $lista)
    {
        for ($i = 0; $i < count($lista); $i++) {
            if ($lista[$i]['nome'] == $item) {
                return true;
            }
        }
        return false;
    }

    protected function updatebemvindo(Request $request)
    {
        $user = auth()->user();

        if ($user) {
            if (($user->tipoconta == 'vendor' || $user->tipoconta == 'client') && $user->tipopessoa == 'juridica'){

                $docsNaBase = $user->documentos()->get();
                $docsNoRequest = $request->lstFiles;

                for ($i = 0; $i < count($docsNaBase); $i++) { // deleta docs da base que não estão no request
                    $fileName = $docsNaBase[$i]->namestore;
                    if (!$this->temFileNaLista($fileName, $docsNoRequest)) {
                        Arquivo::Deletar('docsclientes', $fileName);
                        Docsclientes::where(['id_client' => $user->id, 'namestore' => $fileName])->delete(); // deleta registro
                    }
                }

                for ($i = 0; $i < count($docsNoRequest); $i++) {
                    $item = $docsNoRequest[$i];
                    $namestore = $item['namestore'];
                    if (!$this->temFileNaLista($namestore, $docsNaBase)) {
                        $docsClientes = new Docsclientes();
                        $docsClientes->id_client = $user->id;
                        $docsClientes->name = $item['nome'];
                        $base64 =  $item['base64'];
                        $fileName = 'profile-' . time() . $i . '.dat';

                        Arquivo::Salvar($base64, 'docsclientes', $fileName);

                        $docsClientes->namestore = $fileName;
                        //S torage::disk('docsclientes')->put($fileName, $base64);
                        $docsClientes->save();
                    }
                }
            }else if ( $user->tipoconta == 'client' && $user->tipopessoa == 'fisica'){
                $base64 = $request->foto;
                if ($base64 != 'null') {

                    $existeimgprofile = Perfil::where('id_client',$user->id)->first();

                    if($existeimgprofile ){
                        $fileName = $existeimgprofile->namestore;
                        Arquivo::Deletar( 'imgprofile', $fileName );
                        $existeimgprofile->delete();
                    }

                    $imgProfile = new Perfil();
                    $imgProfile->id_client = $user->id;
                    $imgProfile->name = 'img-Profile';
                    $fileName = 'profile' . $user->id . 'dat';
                    $imgProfile->namestore = $fileName;
                    Arquivo::Salvar($base64, 'imgprofile', $fileName);
                    $imgProfile->save();
                }
            }


            $dado = $request->only('name', 'apelido', 'nomeempresa', 'cpf', 'cnpj', 'endereco', 'profissao', 'telefone', 'cep', 'cidade', 'estado', 'pais', 'bairro', 'complemento');

            if (($user->tipoconta == 'client' && $user->tipopessoa == 'fisica') || ($user->tipoconta == 'vendor' && $user->tipopessoa == 'fisica')) {
                $dado['status'] = '3';
                $user->update($dado);
                return response()->json(['detalhe' => 'updateok', 'user' => $user]);
            } else {
                $dado['status'] = '2';
                $user->update($dado);
            }

            if ($user->tipoconta == 'vendor' && $user->tipopessoa == 'juridica') {
                $categoriasNaBase =  $user->categorias()->get();
                $categoriasRequest = $request->lstCategorias;

                for ($i = 0; $i < count($categoriasNaBase); $i++) { // remove da base oque não tem no request
                    $item = $categoriasNaBase[$i];

                    if (!$this->temCategoriaNaLista($item->nome, $categoriasRequest)) {
                        Usercategorias::where(['user_id' => $user->id, 'categoria_id' => $item->id])->delete(); //deleta registro
                        $cat  = DB::table('usercategorias as uc')
                            ->Join('categorias as ca',  'ca.id', '=', 'uc.categoria_id')
                            ->where(['ca.nome' => $item->nome])->get();
                        if ($cat->count() == 0) {
                            DB::table('categorias')->where(['nome' => $item->nome])->delete();
                        }
                    }
                }

                for ($i = 0; $i < count($categoriasRequest); $i++) {
                    $item = $categoriasRequest[$i];
                    if (!$this->temCategoriaNaLista($item['nome'], $categoriasNaBase)) { // se usuario não tem categoria
                        $tablecategoria = DB::table('categorias')->where(['nome' => $item['nome']])->first();
                        if (!$tablecategoria) { // se categoria não existir criar
                            $tablecategoria = new Categorias();
                            $tablecategoria->nome = $item['nome'];
                            $tablecategoria->grupo = 'grupo';
                            $tablecategoria->valida = false;
                            $tablecategoria->save();
                            $tbID = $tablecategoria->id;
                        }
                        $tableusercategoria = new Usercategorias();
                        $tableusercategoria->user_id =  $user->id;
                        $tableusercategoria->categoria_id = $tablecategoria->id;
                        $tableusercategoria->save();
                    }
                }
            } else if ($user->tipoconta == 'client' && $user->tipopessoa == 'juridica') {

                $segmento = Segmentos::where('nome',  $request->segmento)->limit(8)
                    ->where(['valida' => true])->first();

                $tableusersegmento = new Usersegmentos();
                $tableusersegmento->user_id =  $user->id;
                $tableusersegmento->segmento_id = $segmento->id;
                $tableusersegmento->save();

                return response()->json(['detalhe' => 'updateok', 'user' => $user, 'segmento' => $tableusersegmento]);
            }

            return response()->json(['detalhe' => 'updateok', 'user' => $user]);
        }

        return response()->json(['detalhe' => 'null']);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard()
    {
        return Auth::guard();
    }

    public function registronohistorico($descricao, $iduser){
        $salvarnohistorico = new Historicousers;
        $salvarnohistorico->descricao = $descricao;
        $salvarnohistorico->id_user = $iduser;
        $salvarnohistorico->save();
    }
}
