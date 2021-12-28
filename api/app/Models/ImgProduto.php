<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImgProduto extends Model
{
    use HasFactory;

    protected $table = 'imgprodutos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_produto',
        'name',
        'namestore',
        'created_at',
        'updated_at'
    ];
}
