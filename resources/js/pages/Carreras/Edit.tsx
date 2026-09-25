import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Carrera {
id: number;
codigo: string;
nombre: string;
estado: boolean;
}

interface Props {
carrera: Carrera;
}

export default function Edit({ carrera }: Props) {

const { data, setData, put, processing, errors } = useForm({
codigo: carrera.codigo,
nombre: carrera.nombre,
estado: carrera.estado,
});

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
</div>
<button type="submit" disabled={processing}>
Actualizar
</button>
</form>
<Link href="/carreras">Volver</Link>
</div>
);
}
