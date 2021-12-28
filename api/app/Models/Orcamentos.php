<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orcamentos extends Model
{
    use HasFactory;

    protected $table = 'orcamentos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_client',
        'orcamento',
        'categorias',
        'propostas',
        'titulo',
        'status',
        'temvisita',
        'descricao',
        'datainiciopublicacao',
        'datafimpublicacao',
        'datafimentrega',
        'datainiciovisita',
        'datafimvisita',
        'created_at',
        'updated_at'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_client', 'id');
    }

    public function propostas()
    {
        return $this->hasMany(Propostas::class, 'id_orcamento', 'id');
    }
    public function produtos()
    {
        return $this->hasMany(Orcaprodutos::class, 'id_orcamento', 'id');
    }

    public function categorias()
    {
        return $this->belongsToMany(Categorias::class, 'orcamentocategorias','orcamento_id','categoria_id');
    }




}
