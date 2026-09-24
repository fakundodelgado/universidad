<?php
namespace Database\Seeders;
use App\Models\Materia;
use Illuminate\Database\Seeder;
class MateriaSeeder extends Seeder
{
 public function run(): void
 {
 Materia::create([
 'codigo' => 'AYED',
 'nombre' => 'Algoritmos y Estructuras de Datos',
 'anio' => 2,
 'cuatrimestre' => 1,
 'estado' => true,
 ]);
 Materia::create([
 'codigo' => 'PAW',
 'nombre' => 'Programación de Aplicaciones Web',
 'anio' => 3,
 'cuatrimestre' => 1,
 'estado' => true,
 ]);
 Materia::create([
 'codigo' => 'BD',
 'nombre' => 'Bases de Datos',
 'anio' => 2,
 'cuatrimestre' => 1,
 'estado' => true,
 ]);
 Materia::create([
 'codigo' => 'SO',
 'nombre' => 'Sistemas Operativos',
 'anio' => 2,
 'cuatrimestre' => 2,
 'estado' => true,
 ]);
 }
}

