import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
}

interface Profesor {
    id: number;
    dni: string;
    apellido: string;
    nombre: string;
    email: string;
    estado: boolean;
    materias: Materia[];
}

interface Props {
    profesor: Profesor;
    materias: Materia[];
}

export default function Edit({ profesor, materias }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        dni: profesor.dni,
        apellido: profesor.apellido,
        nombre: profesor.nombre,
        email: profesor.email,
        estado: profesor.estado,
        materias: profesor.materias ? profesor.materias.map((materia) => materia.id) : [],
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
        put(`/profesores/${profesor.id}`);
    };

    return (
        <div>
            <h1>Editar profesor</h1>
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
                    Actualizar
                </button>
            </form>
            <Link href="/profesores">Volver</Link>
        </div>
    );
}