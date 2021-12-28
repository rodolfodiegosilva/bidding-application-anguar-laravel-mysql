<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orcamentocategorias extends Model
{
    use HasFactory;
    protected $table = 'orcamentocategorias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'categoria_id',
        'orcamento_id',
        'created_at',
        'updated_at'
    ];


    public function categorias()
    {
        return $this->hasMany(Categorias::class, 'id', 'categoria_id');
    }
}
