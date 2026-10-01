<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Materia;
use App\Models\Profesor;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Obtener métricas generales
        $metrics = [
            'total_carreras'   => Carrera::count(),
            'carreras_activas' => Carrera::where('estado', true)->count(),
            'total_materias'   => Materia::count(),
            'total_profesores' => Profesor::count(),
        ];

        // 2. Datos para el gráfico de carreras
        $carreras = Carrera::withCount('materias')->get();

        // 3. Datos para el gráfico de materias por año
        $materiasPorAnio = Materia::query()
            ->select('anio', DB::raw('count(*) as total'))
            ->groupBy('anio')
            ->orderBy('anio')
            ->get()
            ->map(fn ($item) => [
                'name'  => "Año {$item->anio}",
                'value' => (int) $item->total,
            ]);

        // 4. Materias recientes con relaciones
        $materiasRecientes = Materia::with(['carreras', 'profesores'])
            ->latest()
            ->take(6)
            ->get();

        // 5. Renderizar vista con Inertia
        return Inertia::render('dashboard', [
            'metrics'         => $metrics,
            'carreras'        => $carreras,
            'materiasPorAnio' => $materiasPorAnio,
            'materias'        => $materiasRecientes,
        ]);
    }
}
