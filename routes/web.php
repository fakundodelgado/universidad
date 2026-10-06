<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::get('/carreras/export', [CarreraController::class, 'export'])->name('carreras.export');

Route::resource('carreras', CarreraController::class);

Route::get('/carreras/{carrera}/plan', [CarreraController::class, 'plan'])->name('carreras.plan');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/settings.php';
