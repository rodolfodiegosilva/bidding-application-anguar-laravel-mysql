<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmentos extends Model
{
    use HasFactory;

    protected $table = 'segmentos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nome',
        'grupo',
        'valida',
        'created_at',
        'updated_at'
    ];
    public function usersegmento() {
        return $this->belongsTo(Usersegmentos::class, 'segmento_id', 'id');
    }
}
