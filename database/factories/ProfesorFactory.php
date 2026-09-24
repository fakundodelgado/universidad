<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class ProfesorFactory extends Factory
{
 public function definition(): array
 {
 return [
 'dni' => fake()->unique()->numerify('########'),
 'apellido' => fake()->lastName(),
 'nombre' => fake()->firstName(),
 'email' => fake()->unique()->safeEmail(),
 'estado' => true,
 ];
 }
}

