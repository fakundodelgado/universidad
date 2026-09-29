<?php

namespace Database\Seeders;

use App\Models\Carrera;
use App\Models\Materia;
use Illuminate\Database\Seeder;
class RelacionesSeeder extends Seeder
{
 public function run(): void
 {

    $las = Carrera::where('codigo', 'LAS')->firstOrFail();
    $tup = Carrera::where('codigo', 'TUP')->firstOrFail();
    $ayed = Materia::where('codigo', 'AYED')->firstOrFail();
    $so = Materia::where('codigo', 'SO')->firstOrFail();
    $bd = Materia::where('codigo', 'BD')->firstOrFail();
    $paw = Materia::where('codigo', 'PAW')->firstOrFail();

    $las->materias()->attach([$ayed->id,
    $so->id,
    $bd->id,
    ]);

    $tup->materias()->attach([
    $ayed->id,
    $paw->id,
    ]);
 // Se completará cuando trabajemos las relaciones N:M.
 }
}

