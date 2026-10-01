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
 
   Profesor::find(1)?->materias()->attach([$ayed->id, $so->id]);
   Profesor::find(2)?->materias()->attach([$paw->id, $bd->id]);
   Profesor::find(3)?->materias()->attach([$ayed->id, $paw->id]);
   Profesor::find(4)?->materias()->attach([$bd->id, $so->id]);
   Profesor::find(5)?->materias()->attach([$ayed->id, $bd->id]);
   Profesor::find(6)?->materias()->attach([$paw->id, $so->id]);
   Profesor::find(7)?->materias()->attach([$ayed->id]);
   Profesor::find(8)?->materias()->attach([$bd->id]);
   Profesor::find(9)?->materias()->attach([$paw->id]);
   Profesor::find(10)?->materias()->attach([$so->id]);

 }
}

