<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produtos extends Model
{
    use HasFactory;

    protected $table = 'orcaprodutos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_orcamento',
        'partnumber',
        'ncm',
        'mdescricao',
        'fabricante',
        'qtd',
        'updated_at',
        'created_at'
    ];

    /*public function Orcamentos()
    {
        return $this->belongsTo(Orcamentos::class, 'id_orcamento', 'id');
    }*/
}

