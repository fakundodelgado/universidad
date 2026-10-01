import { Link } from '@inertiajs/react';
interface Materia {
id: number;
codigo: string;
nombre: string;
}
interface Carrera {
id: number;
codigo: string;
nombre: string;
estado: boolean;
materias: Materia[];
}
interface Props {
carrera: Carrera;
}
export default function Show({ carrera }: Props) {
return (
<div>
<h1>{carrera.nombre}</h1>
<p>Código: {carrera.codigo}</p>
<p>Estado: {carrera.estado ? 'Activa' : 'Inactiva'}</p>
<h2>Materias</h2>
<ul>
{carrera.materias.map((materia) => (
<li key={materia.id}>
{materia.codigo} - {materia.nombre}
</li>
))}
</ul>
<Link href="/carreras">Volver</Link>
</div>
);
}