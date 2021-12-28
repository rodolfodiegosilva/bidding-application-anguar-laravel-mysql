<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitacaocontato extends Model
{
    use HasFactory;

    protected $table = 'solicitacaocontato';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'mensagem',
        'checada',
        'telefone',
        'created_at',
        'updated_at'
    ];
}
