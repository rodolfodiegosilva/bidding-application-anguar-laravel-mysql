<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Propostaprod extends Model
{
    use HasFactory;

    protected $table = 'propostaprod';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_proposta',
        'id_orcaproduto',
        'valorunitario',
        'valortotal',
        'dataentrega',
        'created_at',
        'updated_at'
    ];



    public function produto()
    {
        return $this->hasOne(Orcaprodutos::class, 'id', 'id_orcaproduto');
    }
    //public function docsproposta()
   // {
    //    return $this->hasOne(Docsproposta::class, 'id_proposta', 'id_proposta');
   // }
}
