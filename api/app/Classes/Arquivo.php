<?php

namespace App\Classes;

use Illuminate\Support\Facades\Storage;

class Arquivo
{
    public static function Salvar($base64, $subDiretorio, $fileName)
    {

        Storage::disk($subDiretorio)->put($fileName, $base64);

    }

    public static function abrir($subDiretorio, $fileName)
    {
        $filePath = $subDiretorio . '\\' . $fileName;  // caminho que vc definiu

        if (Storage::disk('local')->exists($filePath)) {
            return  Storage::disk('local')->get($filePath);
        }
        return null;
    }

    public static function Deletar($subDiretorio, $fileName)
    {
        $filePath = $subDiretorio . '\\' . $fileName;

        if (Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->delete($filePath);
        }
    }
}
