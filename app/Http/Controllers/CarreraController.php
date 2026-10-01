<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\Materia;
use Illuminate\Support\Facades\Auth;
use App\Mail\SendMail;
use Illuminate\Support\Facades\Mail;






class CarreraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

    $buscar = trim($request->input('buscar', ''));
    $materia = $request->input('materia', '');
    $orden = $request->input('orden', 'nombre');
    $direccion = $request->input('direccion', 'asc');
    $camposPermitidos = ['codigo', 'nombre', 'estado'];

    if (!in_array($orden, $camposPermitidos, true)) {
    $orden = 'nombre';
    }

    if (!in_array($direccion, ['asc', 'desc'], true)) {
    $direccion = 'asc';
    }

    $carreras = Carrera::with('materias')
    ->when($buscar !== '', function ($query) use ($buscar) {
        $query->where('nombre', 'like', "%{$buscar}%");
    })
    ->when($request->filled('materia'), function ($query) use ($materia) {
        $query->whereHas('materias', function ($q) use ($materia) {
            $q->where('materias.id', $materia);
    });
    })
    ->orderBy($orden, $direccion)
    ->get();

    return Inertia::render('Carreras/Index', [
    'carreras' => $carreras,
    'materias' => Materia::orderBy('nombre')->get(),
    'filtros' => [
    'buscar' => $buscar,
    'materia' => $materia,
    'orden' => $orden,
    'direccion' => $direccion,
    ],
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

    $data = array(
        'name' => Auth::user()->name,
        'email' => Auth::user()->email,
        'carrera_nombre' => $validated['nombre'],
        'carrera_codigo' => $validated['codigo']
    );

    Mail::to($data['email'])->send(new SendMail($data));

    return redirect()->route('carreras.index')
    ->with('success', 'Carrera creada correctamente.');

    }


    /**
     * Display the specified resource.
     */
    public function show(Carrera $carrera)
    {
    $carrera->load('materias');
    return Inertia::render('Carreras/Show', [
    'carrera' => $carrera,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Carrera $carrera)
    {

    $carrera->load('materias');

    return Inertia::render('Carreras/Edit', [
    'carrera' => $carrera,
    'materias' => Materia::orderBy('nombre')->get(),
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carrera $carrera)
    {
    $validated = $request->validate([
    'codigo' => [
    'required',
    'string',
    'max:10',
    Rule::unique('carreras', 'codigo')->ignore($carrera->id),
    ],
    'nombre' => 'required|string|max:150',
    'estado' => 'required|boolean',
    'materias' => 'array',
    'materias.*' => 'integer|exists:materias,id',
    ]);
    $carrera->update([
    'codigo' => $validated['codigo'],
    'nombre' => $validated['nombre'],
    'estado' => $validated['estado'],
    ]);
    $carrera->materias()->sync($validated['materias'] ?? []);
    return redirect()
    ->route('carreras.index')
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
