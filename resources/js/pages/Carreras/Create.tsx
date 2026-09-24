import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
export default function Create() {
 const { data, setData, post, processing, errors } = useForm({
 codigo: '',
 nombre: '',
 estado: true,
 });
 const submit = (e: FormEvent) => {
 e.preventDefault();
 post('/carreras');
 };
 return (
 <div>
 <h1>Nueva carrera</h1>
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
 <button type="submit" disabled={processing}>
 {processing ? 'Guardando...' : 'Guardar'}
 </button>
 </form>
 <Link href="/carreras">Volver</Link>
 </div>
 );
}