<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SegmentosSeeder extends Seeder
{
    static $segmentos = [
        'Segmento 1',
        'Segmento 2',
        'Segmento 3',
        'Segmento 4',
        'Segmento 5'
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::$segmentos as $segmento) {
            DB::table('segmentos')->insert([
                'nome' => $segmento,
                'valida'=> true,
                'grupo'=>'grupo'
            ]);
        }
    }
}
