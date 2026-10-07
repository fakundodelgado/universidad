<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Materia;
use App\Models\Profesor;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Métricas e información previa del PDF
        $metrics = [
            'total_carreras' => Carrera::count(),
            'carreras_activas' => Carrera::where('estado', true)->count(),
            'total_materias' => Materia::count(),
            'total_profesores' => Profesor::count(),
        ];

        $carreras = Carrera::withCount('materias')->get();

        $materiasPorAnio = Materia::select('anio', DB::raw('count(*) as total'))
            ->groupBy('anio')
            ->orderBy('anio')
            ->get()
            ->map(fn($item) => [
                'name' => "Año {$item->anio}",
                'value' => (int) $item->total,
            ]);

        $materias = Materia::with(['carreras', 'profesores'])
            ->latest()
            ->take(6)
            ->get();

        // Consultamos las materias con la cantidad de profesores que tienen asignados
        $profesoresPorMateria = Materia::withCount('profesores')
            ->orderBy('profesores_count', 'desc')
            ->get()
            ->map(fn($materia) => [
                'nombre' => $materia->codigo ?? $materia->nombre, // Usamos el código o nombre corto
                'profesores' => (int) $materia->profesores_count,
            ]);

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'carreras' => $carreras,
            'materiasPorAnio' => $materiasPorAnio,
            'materias' => $materias,
            'profesoresPorMateria' => $profesoresPorMateria, // <-- Nueva prop enviada a React
        ]);
    }
}

