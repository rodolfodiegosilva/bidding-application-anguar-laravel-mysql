<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class CategoriasSeeder extends Seeder
{
    static $categorias = [
        'Tecnologia',
        'Refrigreração',
        'Contabilidade',
        'Advocacia',
        'Elétrica',
        'Construção Civil',
        'Infraestrutura'
    ];


    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::$categorias as $categoria) {
            DB::table('categorias')->insert([
                'nome' => $categoria,
                'valida'=> true,
                'grupo'=>'grupo'
            ]);
        }
    }
}
