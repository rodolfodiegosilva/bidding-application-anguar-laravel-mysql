<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orcaprodutos extends Model
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
        'nome',
        'descricao',
        'qtd',
        'fabricante',
        'imgproduto',
        'proposta',
        'created_at',
        'updated_at'
    ];

    public function orcamento()
    {
        return $this->belongsTo(Orcamentos::class, 'id_orcamento', 'id');
    }
    public function imgproduto()
    {
        return $this->hasOne(ImgProduto::class, 'id_produto', 'id');
    }
    public function propostasprod()
    {
        return $this->hasMany(Propostaprod::class, 'id_orcaproduto', 'id');
    }
}
