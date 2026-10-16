<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfesorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dni' => ['required', 'string', 'max:20', 'unique:profesores,dni'],
            'apellido' => ['required', 'string', 'max:100'],
            'nombre' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:profesores,email'],
            'estado' => ['required', 'boolean'],
            'materias' => ['nullable', 'array'],
            'materias.*' => ['integer', 'exists:materias,id'],
            'foto'     => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // máx 2MB
        ];
    }

    public function attributes(): array
    {
        return [
            'dni' => 'DNI',
            'apellido' => 'apellido',
            'nombre'   => 'nombre',
            'email' => 'correo electrónico',
            'estado'   => 'estado',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'unique' => 'El :attribute ingresado ya pertenece a otro profesor.',
            'email' => 'El :attribute debe ser una dirección de correo válida.',
            'max'      => 'El campo :attribute no debe superar los :max caracteres.',
            'boolean'  => 'El campo :attribute debe ser verdadero o falso.',
        ];
    }
}
