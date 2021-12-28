<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'apelido',
        'criado',
        'telefone',
        'errocount',
        'id_parent',
        'errodate',
        'email',
        'password',
        'isadmin',
        'tipoconta',
        'nomeempresa',
        'endereco',
        'complemento',
        'bairro',
        'telefone',
        'cep',
        'cidade',
        'tipopessoa',
        'estado',
        'pais',
        'cnpj',
        'cpf',
        'profissao',
        'status',
        'validakey',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function documentos() {
        return $this->hasMany(Docsclientes::class, 'id_client', 'id');
    }
    public function historico() {
        return $this->hasMany(Historicousers::class, 'id_user', 'id');
    }

    public function orcamentos() {
        return $this->hasMany(Orcamentos::class, 'id_client', 'id');
    }

    public function usersegmento() {
        return $this->hasOne(Usersegmentos::class, 'user_id', 'id');
    }


    public function categorias()
    {
        return $this->belongsToMany(Categorias::class, 'usercategorias','user_id','categoria_id');
    }

    public function orcacategorias()
    {
        return $this->belongsToMany(Categorias::class, 'orcamentocategorias','user_id','categoria_id');
    }

}
