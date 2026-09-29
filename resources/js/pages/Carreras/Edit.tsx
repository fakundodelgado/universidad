import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
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
 materias: Materia[];
}
export default function Edit({ carrera, materias }: Props) {
 const { data, setData, put, processing, errors } = useForm({
 codigo: carrera.codigo,
 nombre: carrera.nombre,
 estado: carrera.estado,
 materias: carrera.materias.map((materia) => materia.id),
 });
 const cambiarMateria = (id: number, seleccionada: boolean) => {
 if (seleccionada) {
 setData('materias', [...data.materias, id]);
 } else {
 setData(
 'materias',
 data.materias.filter((materiaId) => materiaId !== id),
 );
 }
 };
 const submit = (e: FormEvent) => {
 e.preventDefault();
 put(`/carreras/${carrera.id}`);
 };
 return (
 <div>
 <h1>Editar carrera</h1>
 <form onSubmit={submit}>
 <div>
 <label>Código</label>
<input
 type="text"
value={data.codigo}
onChange={(e) => setData('codigo', e.target.value)}
 />{errors.codigo && <div>{errors.codigo}</div>}
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
 <label>
 <input
 type="checkbox"
checked={data.estado}
onChange={(e) => setData('estado', e.target.checked)}
 />
Activa
 </label>
 </div>
 <div>
 <h2>Materias</h2>
 {materias.map((materia) => (
 <label key={materia.id}>
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
 <Link href="/carreras">Volver</Link>
 </div>
 );
}