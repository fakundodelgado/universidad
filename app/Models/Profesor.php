<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Storage;
class Profesor extends Model
{
 use HasFactory;
 protected $table = 'profesores';
 protected $fillable = [
 'dni',
 'apellido',
 'nombre',
 'email',
 'foto',
 'estado',
 ];
 // Opcional pero muy útil para mandar la URL lista al frontend:
    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto ? Storage::url($this->foto) : null;
    }

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