<?php

namespace Database\Seeders;

use App\Models\Usercategorias;
use App\Models\Usersegmentos;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @return void
     */
    public function run()
    {
        $user = \App\Models\User::factory(1)->create([
            'name' => 'Admin',
            'apelido'=> 'Admin',
            'email' => 'admin@gmail.com',
            'password'=>'$2y$10$Qv4/2GTnM3/ZxY5TMfvMeu/u8CCUfe6U0NftGjVmTDeqCXmB0b3IC',
            'isadmin'=> '1',
            'tipoconta' => 'vendor',
            'nomeempresa' => 'Admin',
            'tipopessoa' => 'juridica',
            'cnpj' => '40.686.916/0002-61',
            'status' => '3',
            'telefone' => '(92) 9 8155-3139',
            'endereco' => 'RUA RODRIGUES ALVES, 174',
            'cep' => '69040-180',
            'cidade' => 'Manaus',
            'estado' => 'Amazonas',
            'cidade' => 'Manaus'
        ]);

        $user = \App\Models\User::factory(1)->create([
            'name' => 'Cliente 1',
            'apelido'=> 'Cliente 1',
            'email' => 'cliente1@gmail.com',
            'password'=>'$2y$10$Qv4/2GTnM3/ZxY5TMfvMeu/u8CCUfe6U0NftGjVmTDeqCXmB0b3IC',
            'isadmin'=> '0',
            'tipoconta' => 'client',
            'nomeempresa' => 'Cliente 1 S/A',
            'tipopessoa' => 'juridica',
            'cnpj' => '40.686.916/0001-61',
            'status' => '1',
            'telefone' => '(92) 9 8155-3139',
            'endereco' => 'RUA RODRIGUES ALVES, 174',
            'cep' => '69040-180',
            'cidade' => 'Manaus',
            'estado' => 'Amazonas',
            'cidade' => 'Manaus'
        ]);

        $user = \App\Models\User::factory(1)->create([
            'name' => 'Fornecedor 1',
            'apelido'=> 'Fornecedor 1',
            'email' => 'fornecedor1@gmail.com',
            'password'=>'$2y$10$Qv4/2GTnM3/ZxY5TMfvMeu/u8CCUfe6U0NftGjVmTDeqCXmB0b3IC',
            'isadmin'=> '0',
            'tipoconta' => 'vendor',
            'nomeempresa' => 'Fornecedor 1 S/A',
            'tipopessoa' => 'juridica',
            'cnpj' => '40.686.916/0001-62',
            'status' => '1',
            'telefone' => '(92) 9 8155-3139',
            'endereco' => 'RUA RODRIGUES ALVES, 174',
            'cep' =>'69040-180',
            'cidade' => 'Manaus',
            'estado' => 'Amazonas',
            'cidade' => 'Manaus'
        ]);

    }
}
