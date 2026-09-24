<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
 public function up(): void
 {
 Schema::create('materia_profesor', function (Blueprint $table) {
 $table->id();
 $table->foreignId('materia_id')
 ->constrained('materias')
 ->cascadeOnDelete();
 $table->foreignId('profesor_id')
 ->constrained('profesores')
 ->cascadeOnDelete();
 $table->timestamps();
 $table->unique(['materia_id', 'profesor_id']);
 });
 }
 public function down(): void
 {
 Schema::dropIfExists('materia_profesor');
 }
};
