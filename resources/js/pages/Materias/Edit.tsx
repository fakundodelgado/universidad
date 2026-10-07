import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Profesor {
    id: number;
    apellido: string;
    nombre: string;
}

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
    anio: number;
    cuatrimestre: number;
    estado: boolean;
    profesores: Profesor[];
}

interface Props {
    materia: Materia;
    profesores: Profesor[];
}

export default function Edit({ materia, profesores }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        codigo: materia.codigo,
        nombre: materia.nombre,
        anio: materia.anio,
        cuatrimestre: materia.cuatrimestre,
        estado: materia.estado,
        profesores: materia.profesores ? materia.profesores.map((p) => p.id) : [],
    });

    const cambiarProfesor = (id: number, seleccionado: boolean) => {
        if (seleccionado) {
            setData('profesores', [...data.profesores, id]);
        } else {
            setData(
                'profesores',
                data.profesores.filter((profesorId) => profesorId !== id)
            );
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/materias/${materia.id}`);
    };

    return (
        <div>
            <h1>Editar materia</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Código</label>
                    <input
                        type="text"
                        value={data.codigo}
                        onChange={(e) => setData('codigo', e.target.value)}
                    />
                    {errors.codigo && <div>{errors.codigo}</div>}
                </div>

                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                    />
                    {errors.nombre && <div>{errors.nombre}</div>}
                </div>

                <div>
                    <label>Año</label>
                    <input
                        type="number"
                        min="1"
                        max="6"
                        value={data.anio}
                        onChange={(e) => setData('anio', Number(e.target.value))}
                    />
                    {errors.anio && <div>{errors.anio}</div>}
                </div>

                <div>
                    <label>Cuatrimestre</label>
                    <input
                        type="number"
                        min="1"
                        max="2"
                        value={data.cuatrimestre}
                        onChange={(e) => setData('cuatrimestre', Number(e.target.value))}
                    />
                    {errors.cuatrimestre && <div>{errors.cuatrimestre}</div>}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={data.estado}
                            onChange={(e) => setData('estado', e.target.checked)}
                        />
                        Activa
                    </label>
                    {errors.estado && <div>{errors.estado}</div>}
                </div>

                <div>
                    <h2>Profesores a cargo</h2>
                    {profesores.map((profesor) => (
                        <label key={profesor.id} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                checked={data.profesores.includes(profesor.id)}
                                onChange={(e) =>
                                    cambiarProfesor(profesor.id, e.target.checked)
                                }
                            />
                            {profesor.apellido}, {profesor.nombre}
                        </label>
                    ))}
                    {errors.profesores && <div>{errors.profesores}</div>}
                </div>

                <button type="submit" disabled={processing}>
                    Actualizar
                </button>
            </form>
            <Link href="/materias">Volver</Link>
        </div>
    );
}