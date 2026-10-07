<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfesorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));
        $materia = $request->input('materia', '');
        $orden = $request->input('orden', 'apellido');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $camposPermitidos = ['dni', 'apellido', 'nombre', 'email', 'estado'];

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'apellido';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        $profesores = Profesor::with('materias')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('dni', 'like', "%{$buscar}%")
                      ->orWhere('apellido', 'like', "%{$buscar}%")
                      ->orWhere('nombre', 'like', "%{$buscar}%")
                      ->orWhere('email', 'like', "%{$buscar}%");
                });
            })
            ->when($request->filled('materia'), function ($query) use ($materia) {
                $query->whereHas('materias', function ($q) use ($materia) {
                    $q->where('materias.id', $materia);
                });
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Profesores/Index', [
            'profesores' => $profesores,
            'materias' => Materia::orderBy('nombre')->get(),
            'filtros' => [
                'buscar' => $buscar,
                'materia' => $materia,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Profesores/Create', [
            'materias' => Materia::orderBy('nombre')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dni' => 'required|string|max:20|unique:profesores,dni',
            'apellido' => 'required|string|max:100',
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:profesores,email',
            'estado' => 'required|boolean',
            'materias' => 'array',
            'materias.*' => 'integer|exists:materias,id',
        ]);

        $profesor = Profesor::create([
            'dni' => $validated['dni'],
            'apellido' => $validated['apellido'],
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'estado' => $validated['estado'],
        ]);

        $profesor->materias()->sync($validated['materias'] ?? []);

        return redirect()
            ->route('profesores.index')
            ->with('success', 'Profesor creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Profesor $profesor)
    {
        $profesor->load('materias');

        return Inertia::render('Profesores/Show', [
            'profesor' => $profesor,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Profesor $profesor)
    {
        $profesor->load('materias');

        return Inertia::render('Profesores/Edit', [
            'profesor' => $profesor,
            'materias' => Materia::orderBy('nombre')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Profesor $profesor)
    {
        $validated = $request->validate([
            'dni' => [
                'required',
                'string',
                'max:20',
                Rule::unique('profesores', 'dni')->ignore($profesor->id),
            ],
            'apellido' => 'required|string|max:100',
            'nombre' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('profesores', 'email')->ignore($profesor->id),
            ],
            'estado' => 'required|boolean',
            'materias' => 'array',
            'materias.*' => 'integer|exists:materias,id',
        ]);

        $profesor->update([
            'dni' => $validated['dni'],
            'apellido' => $validated['apellido'],
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'estado' => $validated['estado'],
        ]);

        $profesor->materias()->sync($validated['materias'] ?? []);

        return redirect()
            ->route('profesores.index')
            ->with('success', 'Profesor actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Profesor $profesor)
    {
        $profesor->delete();

        return redirect()
            ->route('profesores.index')
            ->with('success', 'Profesor eliminado correctamente.');
    }
}