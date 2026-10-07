<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MateriaController extends Controller
{
    public function index(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $camposPermitidos = ['codigo', 'nombre', 'anio', 'cuatrimestre', 'estado'];

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'nombre';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        $materias = Materia::with(['carreras', 'profesores'])
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('codigo', 'like', "%{$buscar}%")
                      ->orWhere('nombre', 'like', "%{$buscar}%");
                });
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Materias/Index', [
            'materias' => $materias,
            'filtros' => [
                'buscar' => $buscar,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Materias/Create', [
            'profesores' => Profesor::orderBy('apellido')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:10|unique:materias,codigo',
            'nombre' => 'required|string|max:150',
            'anio' => 'required|integer|min:1|max:6',
            'cuatrimestre' => 'required|integer|min:1|max:2',
            'estado' => 'required|boolean',
            'profesores' => 'array',
            'profesores.*' => 'integer|exists:profesores,id',
        ]);

        $materia = Materia::create([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'anio' => $validated['anio'],
            'cuatrimestre' => $validated['cuatrimestre'],
            'estado' => $validated['estado'],
        ]);

        $materia->profesores()->sync($validated['profesores'] ?? []);

        return redirect()
            ->route('materias.index')
            ->with('success', 'Materia creada correctamente.');
    }

    public function show(Materia $materia)
    {
        $materia->load(['carreras', 'profesores']);

        return Inertia::render('Materias/Show', [
            'materia' => $materia,
        ]);
    }

    public function edit(Materia $materia)
    {
        $materia->load('profesores');

        return Inertia::render('Materias/Edit', [
            'materia' => $materia,
            'profesores' => Profesor::orderBy('apellido')->get(),
        ]);
    }

    public function update(Request $request, Materia $materia)
    {
        $validated = $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:10',
                Rule::unique('materias', 'codigo')->ignore($materia->id),
            ],
            'nombre' => 'required|string|max:150',
            'anio' => 'required|integer|min:1|max:6',
            'cuatrimestre' => 'required|integer|min:1|max:2',
            'estado' => 'required|boolean',
            'profesores' => 'array',
            'profesores.*' => 'integer|exists:profesores,id',
        ]);

        $materia->update([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'anio' => $validated['anio'],
            'cuatrimestre' => $validated['cuatrimestre'],
            'estado' => $validated['estado'],
        ]);

        $materia->profesores()->sync($validated['profesores'] ?? []);

        return redirect()
            ->route('materias.index')
            ->with('success', 'Materia actualizada correctamente.');
    }

    public function destroy(Materia $materia)
    {
        $materia->delete();

        return redirect()
            ->route('materias.index')
            ->with('success', 'Materia eliminada correctamente.');
    }
}
