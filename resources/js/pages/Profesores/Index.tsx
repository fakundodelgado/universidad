import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
}

interface Filtros {
    buscar: string;
    materia: string;
    orden: string;
    direccion: string;
    por_pagina: number;
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

interface LinkPaginacion {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProfesoresPaginados {
    data: Profesor[];
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
    profesores: ProfesoresPaginados;
    materias?: Materia[];
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}

export default function Index({ profesores, materias = [], filtros, flash }: Props) {
    const [buscar, setBuscar] = useState(filtros?.buscar ?? '');
    const [materia, setMateria] = useState(filtros?.materia ?? '');
    const [orden, setOrden] = useState(filtros?.orden ?? 'apellido');
    const [direccion, setDireccion] = useState(filtros?.direccion ?? 'asc');
    const [porPagina, setPorPagina] = useState(filtros?.por_pagina ?? 5);

    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar este profesor?')) {
            router.delete(`/profesores/${id}`);
        }
    };

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get('/profesores', {
            buscar,
            materia,
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
        router.get('/profesores', {
            buscar,
            materia,
            orden: campo,
            direccion: nuevaDireccion,
            por_pagina: porPagina,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) {
            return '';
        }
        return direccion === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div>
            <h1>Profesores</h1>
            <Link href="/profesores/create">
                Nuevo profesor
            </Link>
            {flash?.success && (
                <div>
                    {flash.success}
                </div>
            )}

            <form onSubmit={aplicarFiltros}>
                <input
                    type="text"
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    placeholder="Buscar profesor..."
                />
                <select
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                >
                    <option value="">Todas las materias</option>
                    {materias?.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.codigo} - {m.nombre}
                        </option>
                    ))}
                </select>
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
                        <th onClick={() => ordenarPor('dni')}>
                            DNI{indicadorOrden('dni')}
                        </th>
                        <th onClick={() => ordenarPor('apellido')}>
                            Apellido{indicadorOrden('apellido')}
                        </th>
                        <th onClick={() => ordenarPor('nombre')}>
                            Nombre{indicadorOrden('nombre')}
                        </th>
                        <th onClick={() => ordenarPor('email')}>
                            Email{indicadorOrden('email')}
                        </th>
                        <th onClick={() => ordenarPor('estado')}>
                            Estado{indicadorOrden('estado')}
                        </th>
                        <th>Materias</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {profesores?.data?.map((profesor) => (
                        <tr key={profesor.id}>
                            <td>{profesor.dni}</td>
                            <td>{profesor.apellido}</td>
                            <td>{profesor.nombre}</td>
                            <td>{profesor.email}</td>
                            <td>{profesor.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                {profesor.materias && profesor.materias.length > 0
                                    ? profesor.materias.map((materia) => materia.codigo).join(', ')
                                    : 'Sin materias'}
                            </td>
                            <td>
                                <Link href={`/profesores/${profesor.id}/edit`}>
                                    Editar
                                </Link>
                                {' | '}
                                <button
                                    type="button"
                                    onClick={() => eliminar(profesor.id)}
                                >
                                    Eliminar
                                </button>
                                {' | '}
                                <Link href={`/profesores/${profesor.id}`}>Materias</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {profesores?.prev_page_url && (
                    <button
                        type="button"
                        onClick={() => router.get(profesores.prev_page_url!)}
                    >
                        Anterior
                    </button>
                )}

                {profesores?.links
                    ?.filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
                    .map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => link.url && router.get(link.url)}
                        >
                            {link.active ? (
                                <strong>{link.label}</strong>
                            ) : (
                                link.label
                            )}
                        </button>
                    ))}

                {profesores?.next_page_url && (
                    <button
                        type="button"
                        onClick={() => router.get(profesores.next_page_url!)}
                    >
                        Siguiente
                    </button>
                )}
            </div>
            <p>
                Mostrando {profesores?.from ?? 0} a {profesores?.to ?? 0}
                {' '}de {profesores?.total ?? 0} profesores
            </p>
        </div>
    );
}