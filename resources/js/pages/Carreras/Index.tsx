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

    const handleExportExcel = () => {
        // Creamos la query string basándonos en los filtros actuales de la vista
        // Ignoramos 'por_pagina' porque el Excel debe bajar todas las filas filtradas,
        //no solo 5 o 10
        const params = new URLSearchParams({
            buscar: filtros.buscar || '',
            materia: filtros.materia || '',
            orden: filtros.orden || 'nombre',
            direccion: filtros.direccion || 'asc',
        }).toString();
        // Redirección nativa para iniciar la descarga del binario
        window.location.href = `/carreras/export?${params}`;
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
                <button
                    onClick={handleExportExcel}
                    /*
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm
                    font-semibold text-white bg-emerald-600 rounded-lg shadow hover:bg-emerald-500
                    transition-colors"
                    */
                >
                    {/*
                    <svg className="w-5 h-5" fill="none" stroke="currentColor"
                        strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0
                        0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414
                        5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    */}

                    Excel

                </button>
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
                        <th>Materias</th>
                        <th>Acciones</th>
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
                                <Link href={`/carreras/${carrera.id}`}>Materias</Link>
                                {' | '}
                                <a
                                    href={`/carreras/${carrera.id}/plan`}
                                    title="Descargar plan de estudio"
                                    target="_blank" // Lo abre en una nueva pestaña.
                                >
                                    PDF 
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {carreras.prev_page_url && (
                    <button
                        type="button"
                        onClick={() => router.get(carreras.prev_page_url!)}
                    >
                        Anterior
                    </button>
                )}

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
