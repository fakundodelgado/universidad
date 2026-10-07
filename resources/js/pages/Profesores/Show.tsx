import { Link } from '@inertiajs/react';

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
}

export default function Show({ profesor }: Props) {
    return (
        <div>
            <h1>{profesor?.apellido}, {profesor?.nombre}</h1>
            <p>DNI: {profesor?.dni}</p>
            <p>Email: {profesor?.email}</p>
            <p>Estado: {profesor?.estado ? 'Activo' : 'Inactivo'}</p>
            <h2>Materias</h2>
            <ul>
                {profesor?.materias && profesor.materias.length > 0 ? (
                    profesor.materias.map((materia) => (
                        <li key={materia.id}>
                            {materia.codigo} - {materia.nombre}
                        </li>
                    ))
                ) : (
                    <li>No tiene materias asignadas</li>
                )}
            </ul>
            <Link href="/profesores">Volver</Link>
        </div>
    );
}