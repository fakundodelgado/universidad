<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\MateriaController;

Route::inertia('/', 'welcome')->name('home');

Route::get('/carreras/export', [CarreraController::class, 'export'])->name('carreras.export');

Route::resource('carreras', CarreraController::class);

Route::get('/carreras/{carrera}/plan', [CarreraController::class, 'plan'])->name('carreras.plan');

Route::resource('profesores', ProfesorController::class)->parameters([
    'profesores' => 'profesor'
]);

Route::resource('materias', MateriaController::class)->parameters([
    'materias' => 'materia'
]);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/settings.php';
