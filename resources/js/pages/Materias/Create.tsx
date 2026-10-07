import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Profesor {
    id: number;
    apellido: string;
    nombre: string;
}

interface Props {
    profesores: Profesor[];
}

export default function Create({ profesores }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        codigo: '',
        nombre: '',
        anio: 1,
        cuatrimestre: 1,
        estado: true,
        profesores: [] as number[],
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
        post('/materias');
    };

    return (
        <div>
            <h1>Nueva materia</h1>
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
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
            <Link href="/materias">Volver</Link>
        </div>
    );
}