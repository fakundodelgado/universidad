<?php
namespace Database\Seeders;
use App\Models\Profesor;
use Illuminate\Database\Seeder;
class ProfesorSeeder extends Seeder
{
 public function run(): void
 {
 Profesor::factory()->count(10)->create();
 }
}
