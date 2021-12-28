<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usersegmentos extends Model
{
    use HasFactory;

    protected $table = 'usersegmentos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'segmento_id',
        'created_at',
        'updated_at'
    ];

    public function segmento() {
        return $this->hasOne(Segmentos::class, 'id', 'segmento_id');
    }
    public function user() {
        return $this->hasOne(Segmentos::class, 'id', 'user_id');
    }
}
