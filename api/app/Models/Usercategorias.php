<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Usercategorias extends Pivot
{
    use HasFactory;

    protected $table = 'usercategorias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'categoria_id',
        'created_at',
        'updated_at'
    ];


}
