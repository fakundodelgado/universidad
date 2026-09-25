<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use Inertia\Inertia;
use Illuminate\Validation\Rule;




class CarreraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    $carreras = Carrera::all();
    return Inertia::render('Carreras/Index', [
    'carreras' => $carreras,
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('Carreras/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    $validated = $request->validate([
    'codigo' => 'required|string|max:10|unique:carreras,codigo',
    'nombre' => 'required|string|max:150',
    'estado' => 'required|boolean',
    ]);
    Carrera::create($validated);
    return redirect()->route('carreras.index')
    ->with('success', 'Carrera creada correctamente.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Carrera $carrera)
    {
    return Inertia::render('Carreras/Edit', [
    'carrera' => $carrera,
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carrera $carrera)
    {
    $validated = $request->validate(['codigo' => [
    'required',
    'string',
    'max:10',
    Rule::unique('carreras', 'codigo')->ignore($carrera->id),
    ],
    'nombre' => 'required|string|max:150',
    'estado' => 'required|boolean',
    ]);
    $carrera->update($validated);
    return redirect()->route('carreras.index')
    ->with('success', 'Carrera actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carrera $carrera)
    {
    $carrera->delete();
    return redirect()->route('carreras.index')
    ->with('success', 'Carrera eliminada correctamente.');
    }



}
