<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Propostas extends Model
{
    use HasFactory;

    protected $table = 'propostas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_fornecedor',
        'id_orcamento',
        'proposta',
        'valorservico',
        'podoeeditar',
        'dataentrega',
        'docproposta',
        'created_at',
        'updated_at'
    ];



    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_fornecedor', 'id');
    }

    public function docsproposta()
    {
        return $this->hasOne(Docsproposta::class, 'id_proposta', 'id');
    }

    public function propostasprod()
    {
        return $this->hasMany(Propostaprod::class, 'id_proposta', 'id');
    }
}
