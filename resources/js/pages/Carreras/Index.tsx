import { Link } from '@inertiajs/react';
interface Carrera {
 id: number;
 codigo: string;
 nombre: string;
 estado: boolean;
}
interface Props {
 carreras: Carrera[];
}
export default function Index({ carreras }: Props) {
 return (
 <div>
 <h1>Carreras</h1>
 <Link href="/carreras/create">
 Nueva carrera
 </Link>
 <table>
 <thead>
 <tr>
 <th>Código</th>
<th>Nombre</th>
<th>Estado</th>
 </tr>
 </thead>
 <tbody>
 {carreras.map((carrera) => (
 <tr key={carrera.id}>
 <td>{carrera.codigo}</td>
<td>{carrera.nombre}</td>
<td>{carrera.estado ? 'Activa' : 'Inactiva'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}
