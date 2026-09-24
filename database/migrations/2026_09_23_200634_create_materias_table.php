<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
 public function up(): void
 {
 Schema::create('materias', function (Blueprint $table) {
 $table->id();
 $table->string('codigo', 10)->unique();
 $table->string('nombre', 150);
 $table->unsignedTinyInteger('anio');
 $table->unsignedTinyInteger('cuatrimestre');
 $table->boolean('estado')->default(true);
 $table->timestamps();
 });
 }
 public function down(): void
 {
 Schema::dropIfExists('materias');
 }
};
