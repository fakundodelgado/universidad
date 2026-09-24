<?php
namespace Database\Seeders;
use App\Models\Carrera;
use Illuminate\Database\Seeder;
class CarreraSeeder extends Seeder
{
 public function run(): void
 {
 Carrera::create([
 'codigo' => 'LAS',
 'nombre' => 'Licenciatura en Análisis de Sistemas',
 'estado' => true,
 ]);
 Carrera::create([
 'codigo' => 'TUP',
 'nombre' => 'Tecnicatura Universitaria en Programación',
 'estado' => true,
 ]);
 }
}
