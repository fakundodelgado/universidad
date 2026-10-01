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

interface Carrera {
    id: number;
    codigo: string;
    nombre: string;
    estado: boolean;
    materias: Materia[];
}

interface LinkPaginacion {
    url: string | null;
    label: string;
    active: boolean;
}

interface CarrerasPaginadas {
    data: Carrera[];
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
    carreras: CarrerasPaginadas;
    materias: Materia[];
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}
export default function Index({ carreras, materias, filtros, flash }: Props) {

    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [materia, setMateria] = useState(filtros.materia ?? '');
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(filtros.direccion ?? 'asc');
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);

    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar esta carrera?')) {
            router.delete(`/carreras/${id}`);
        }
    };

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get('/carreras', {
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
        router.get('/carreras', {
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
            <h1>Carreras</h1>
            <Link href="/carreras/create">
                Nueva carrera
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
                    placeholder="Buscar carrera..."
                />
                <select
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                >
                    <option value="">Todas las materias</option>
                    {materias.map((m) => (
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
                        <th onClick={() => ordenarPor('codigo')}>
                            Código{indicadorOrden('codigo')}
                        </th>
                        <th onClick={() => ordenarPor('nombre')}>
                            Nombre{indicadorOrden('nombre')}
                        </th>
                        <th onClick={() => ordenarPor('estado')}>
                            Estado{indicadorOrden('estado')}
                        </th>
                        <th>Acciones</th>
                        <th>Materias</th>
                    </tr>
                </thead>
                <tbody>
                    {carreras.data.map((carrera) => ( // Ahora el array de carreras esta en carreras.data, carreras como tal pasa a ser CarrerasPaginadas.
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
            
            <div>
                {/* Botón Anterior */}
                {carreras.prev_page_url && (
                    <button
                        type="button"
                        onClick={() => router.get(carreras.prev_page_url!)}
                    >
                        Anterior
                    </button>
                )}

                {/* Números de página centrales */}
                {carreras.links
                    .filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
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

                {/* Botón Siguiente */}
                {carreras.next_page_url && (
                    <button
                        type="button"
                        onClick={() => router.get(carreras.next_page_url!)}
                    >
                        Siguiente
                    </button>
                )}
            </div>
            <p>
                Mostrando {carreras.from ?? 0} a {carreras.to ?? 0}
                {' '}de {carreras.total} carreras
            </p>
        </div>
    );
}
