import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

interface Carrera {
    id: number;
    codigo: string;
    nombre: string;
}

interface Profesor {
    id: number;
    apellido: string;
    nombre: string;
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

interface Filtros {
    buscar: string;
    orden: string;
    direccion: string;
    por_pagina: number;
}

interface LinkPaginacion {
    url: string | null;
    label: string;
    active: boolean;
}

interface MateriasPaginadas {
    data: Materia[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: LinkPaginacion[];
}

interface Props {
    materias: MateriasPaginadas;
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}

export default function Index({ materias, filtros, flash }: Props) {
    const [buscar, setBuscar] = useState(filtros?.buscar ?? '');
    const [orden, setOrden] = useState(filtros?.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(filtros?.direccion ?? 'asc');
    const [porPagina, setPorPagina] = useState(filtros?.por_pagina ?? 5);

    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar esta materia?')) {
            router.delete(`/materias/${id}`);
        }
    };

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get('/materias', {
            buscar,
            orden,
            direccion,
            por_pagina: porPagina,
        });
    };

    const ordenarPor = (campo: string) => {
        let nuevaDireccion = 'asc';
        if (orden === campo && direccion === 'asc') {
            nuevaDireccion = 'desc';
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);
        router.get('/materias', {
            buscar,
            orden: campo,
            direccion: nuevaDireccion,
            por_pagina: porPagina,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return '';
        return direccion === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div>
            <h1>Materias</h1>
            <Link href="/materias/create">Nueva materia</Link>
            
            {flash?.success && <div>{flash.success}</div>}

            <form onSubmit={aplicarFiltros}>
                <input
                    type="text"
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    placeholder="Buscar materia..."
                />
                <button type="submit">Buscar</button>
                <label>
                    Mostrar:
                    <select
                        value={porPagina}
                        onChange={(e) => setPorPagina(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    filas
                </label>
            </form>

            <table>
                <thead>
                    <tr>
                        <th onClick={() => ordenarPor('codigo')}>Código{indicadorOrden('codigo')}</th>
                        <th onClick={() => ordenarPor('nombre')}>Nombre{indicadorOrden('nombre')}</th>
                        <th onClick={() => ordenarPor('anio')}>Año{indicadorOrden('anio')}</th>
                        <th onClick={() => ordenarPor('cuatrimestre')}>Cuat.{indicadorOrden('cuatrimestre')}</th>
                        <th onClick={() => ordenarPor('estado')}>Estado{indicadorOrden('estado')}</th>
                        <th>Carreras</th>
                        <th>Profesores</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materias?.data?.map((materia) => (
                        <tr key={materia.id}>
                            <td>{materia.codigo}</td>
                            <td>{materia.nombre}</td>
                            <td>{materia.anio}°</td>
                            <td>{materia.cuatrimestre}°</td>
                            <td>{materia.estado ? 'Activa' : 'Inactiva'}</td>
                            <td>
                                {materia.carreras && materia.carreras.length > 0
                                    ? materia.carreras.map((c) => c.codigo).join(', ')
                                    : 'Sin carrera'}
                            </td>
                            <td>
                                {materia.profesores && materia.profesores.length > 0
                                    ? materia.profesores.map((p) => `${p.apellido}, ${p.nombre}`).join('; ')
                                    : 'Sin asignar'}
                            </td>
                            <td>
                                <Link href={`/materias/${materia.id}/edit`}>Editar</Link>
                                {' | '}
                                <button type="button" onClick={() => eliminar(materia.id)}>
                                    Eliminar
                                </button>
                                {' | '}
                                <Link href={`/materias/${materia.id}`}>Ver</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {materias?.prev_page_url && (
                    <button type="button" onClick={() => router.get(materias.prev_page_url!)}>
                        Anterior
                    </button>
                )}

                {materias?.links
                    ?.filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
                    .map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => link.url && router.get(link.url)}
                        >
                            {link.active ? <strong>{link.label}</strong> : link.label}
                        </button>
                    ))}

                {materias?.next_page_url && (
                    <button type="button" onClick={() => router.get(materias.next_page_url!)}>
                        Siguiente
                    </button>
                )}
            </div>
            <p>
                Mostrando {materias?.from ?? 0} a {materias?.to ?? 0} de {materias?.total ?? 0} materias
            </p>
        </div>
    );
}