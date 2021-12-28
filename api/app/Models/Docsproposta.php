<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docsproposta extends Model
{
    use HasFactory;
    protected $table = 'docspropostas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_proposta',
        'name',
        'namestore',
        'created_at',
        'updated_at'
    ];
}
