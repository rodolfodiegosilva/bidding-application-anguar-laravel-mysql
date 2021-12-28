<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docsclientes extends Model
{
    use HasFactory;

    protected $table = 'docsclientes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_client',
        'name',
        'namestore',
        'created_at',
        'updated_at'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_client', 'id');
    }
}
