import { Link } from '@inertiajs/react';

interface Carrera {
    id: number;
    codigo: string;
    nombre: string;
}

interface Profesor {
    id: number;
    apellido: string;
    nombre: string;
    email: string;
}

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
    anio: number;
    cuatrimestre: number;
    estado: boolean;
    carreras: Carrera[];
    profesores: Profesor[];
}

interface Props {
    materia: Materia;
}

export default function Show({ materia }: Props) {
    return (
        <div>
            <h1>{materia?.codigo} - {materia?.nombre}</h1>
            <p><strong>Año:</strong> {materia?.anio}°</p>
            <p><strong>Cuatrimestre:</strong> {materia?.cuatrimestre}°</p>
            <p><strong>Estado:</strong> {materia?.estado ? 'Activa' : 'Inactiva'}</p>

            <h2>Carreras que la incluyen</h2>
            <ul>
                {materia?.carreras && materia.carreras.length > 0 ? (
                    materia.carreras.map((carrera) => (
                        <li key={carrera.id}>
                            {carrera.codigo} - {carrera.nombre}
                        </li>
                    ))
                ) : (
                    <li>No pertenece a ninguna carrera actualmente</li>
                )}
            </ul>

            <h2>Profesores asignados</h2>
            <ul>
                {materia?.profesores && materia.profesores.length > 0 ? (
                    materia.profesores.map((profesor) => (
                        <li key={profesor.id}>
                            {profesor.apellido}, {profesor.nombre} ({profesor.email})
                        </li>
                    ))
                ) : (
                    <li>No tiene profesores asignados</li>
                )}
            </ul>

            <Link href="/materias">Volver</Link>
        </div>
    );
}