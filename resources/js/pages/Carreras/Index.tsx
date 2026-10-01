import { Link, router } from '@inertiajs/react';
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
 carreras: Carrera[];
 flash?: {
 success?: string;
 };
}
export default function Index({ carreras, flash }: Props) {

const eliminar = (id: number) => {
if (confirm('¿Está seguro de eliminar esta carrera?')) {
router.delete(`/carreras/${id}`);
}

};
 return (
 <div>
 <h1>Carreras</h1>
 <Link href="/carreras/create">
 Nueva carrera
 </Link>
{flash?.success && (
<div>
{flash.success}
</div>
)}
 <table>
 <thead>
    <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Estado</th>
        <th>Acciones</th>
        <th>Materias</th>
    </tr>
 </thead>
 <tbody>
    {carreras.map((carrera) => (
    <tr key={carrera.id}>
        <td>{carrera.codigo}</td>
        <td>{carrera.nombre}</td>
        <td>{carrera.estado ? 'Activa' : 'Inactiva'}</td>
        <td>
        {carrera.materias.map((materia) => materia.codigo).join(', ')}
        </td>
        <td>
        <Link href={`/carreras/${carrera.id}/edit`}>
        Editar
        </Link>
        {' | '}
        <button
        type="button"
        onClick={() => eliminar(carrera.id)}
        >
        Eliminar
        </button>
         {' | '}
        <Link href={`/carreras/${carrera.id}`}>Ver</Link>
        </td>
    </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}
