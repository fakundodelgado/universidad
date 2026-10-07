import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
}

interface Props {
    materias: Materia[];
}

export default function Create({ materias }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        dni: '',
        apellido: '',
        nombre: '',
        email: '',
        estado: true,
        materias: [] as number[],
    });

    const cambiarMateria = (id: number, seleccionada: boolean) => {
        if (seleccionada) {
            setData('materias', [...data.materias, id]);
        } else {
            setData(
                'materias',
                data.materias.filter((materiaId) => materiaId !== id)
            );
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/profesores');
    };

    return (
        <div>
            <h1>Nuevo profesor</h1>
            <form onSubmit={submit}>
                <div>
                    <label>DNI</label>
                    <input
                        type="text"
                        value={data.dni}
                        onChange={(e) => setData('dni', e.target.value)}
                    />
                    {errors.dni && <div>{errors.dni}</div>}
                </div>

                <div>
                    <label>Apellido</label>
                    <input
                        type="text"
                        value={data.apellido}
                        onChange={(e) => setData('apellido', e.target.value)}
                    />
                    {errors.apellido && <div>{errors.apellido}</div>}
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
                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <div>{errors.email}</div>}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={data.estado}
                            onChange={(e) => setData('estado', e.target.checked)}
                        />
                        Activo
                    </label>
                    {errors.estado && <div>{errors.estado}</div>}
                </div>

                <div>
                    <h2>Materias</h2>
                    {materias.map((materia) => (
                        <label key={materia.id} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                checked={data.materias.includes(materia.id)}
                                onChange={(e) =>
                                    cambiarMateria(materia.id, e.target.checked)
                                }
                            />
                            {materia.codigo} - {materia.nombre}
                        </label>
                    ))}
                    {errors.materias && <div>{errors.materias}</div>}
                </div>

                <button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
            <Link href="/profesores">Volver</Link>
        </div>
    );
}