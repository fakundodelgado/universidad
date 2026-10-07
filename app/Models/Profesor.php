<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Profesor extends Model
{
 use HasFactory;
 protected $table = 'profesores';
 protected $fillable = [
 'dni',
 'apellido',
 'nombre',
 'email',
 'estado',
 ];

public function materias()
    {
        return $this->belongsToMany(Materia::class, 'materia_profesor')
                    ->withTimestamps();
    }

/*
  public function materias()
{
    return $this->belongsToMany(Materia::class);
} 

*/

}