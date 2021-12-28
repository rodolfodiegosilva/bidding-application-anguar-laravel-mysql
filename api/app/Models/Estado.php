<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    use HasFactory;


    protected $table = 'estados';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'CodigoUf',
        'Nome',
        'Uf',
        'Regiao',
        'created_at',
        'updated_at'
    ];

    public function municipios() {
        return $this->hasMany(Municipio::class, 'Uf', 'Uf');
    }
}
