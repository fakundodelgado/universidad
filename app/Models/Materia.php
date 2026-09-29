<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Materia extends Model
{
 use HasFactory;
 protected $fillable = [
 'codigo', 'nombre', 'anio', 'cuatrimestre', 'estado'
 ];

 public function carreras()
{
 return $this->belongsToMany(Carrera::class, 'carrera_materia')
 ->withTimestamps();
}

}

