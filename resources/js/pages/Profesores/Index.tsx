import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Users, CheckCircle2, Search, Filter, Book, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        if (orden !== campo) return <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-40" />;
        return direccion === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <>
            <Head title="Cuerpo Docente" />

            <div className="flex-1 space-y-6 p-8 pt-6">
                {/* Header de la vista */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Profesores</h2>
                        <p className="text-muted-foreground">
                            Gestión y administración del cuerpo docente universitario.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/profesores/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Profesor
                        </Link>
                    </Button>
                </div>

                {/* Mensaje Flash de éxito */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Barra de Filtros y Búsqueda */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={aplicarFiltros} className="flex flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={buscar}
                                    onChange={(e) => setBuscar(e.target.value)}
                                    placeholder="Buscar por DNI, nombre, email..."
                                    className="w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>

                            <select
                                value={materia}
                                onChange={(e) => setMateria(e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Todas las materias</option>
                                {materias?.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.codigo} - {m.nombre}
                                    </option>
                                ))}
                            </select>

                            <Button type="submit" variant="secondary" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtrar
                            </Button>

                            <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                                <span>Mostrar:</span>
                                <select
                                    value={porPagina}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setPorPagina(val);
                                        router.get('/profesores', { buscar, materia, orden, direccion, por_pagina: val });
                                    }}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabla de Profesores */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    Docentes Registrados
                                </CardTitle>
                                <CardDescription>
                                    Listado general de profesores habilitados en el sistema
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">Total: {profesores?.total ?? 0}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px] cursor-pointer select-none" onClick={() => ordenarPor('dni')}>
                                        DNI {indicadorOrden('dni')}
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => ordenarPor('apellido')}>
                                        Apellido {indicadorOrden('apellido')}
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => ordenarPor('nombre')}>
                                        Nombre {indicadorOrden('nombre')}
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => ordenarPor('email')}>
                                        Email {indicadorOrden('email')}
                                    </TableHead>
                                    <TableHead className="w-[100px] cursor-pointer select-none" onClick={() => ordenarPor('estado')}>
                                        Estado {indicadorOrden('estado')}
                                    </TableHead>
                                    <TableHead>Materias</TableHead>
                                    <TableHead className="w-[120px] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profesores?.data?.map((profesor) => (
                                    <TableRow key={profesor.id}>
                                        <TableCell className="font-mono text-xs">{profesor.dni}</TableCell>
                                        <TableCell className="font-medium">{profesor.apellido}</TableCell>
                                        <TableCell>{profesor.nombre}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{profesor.email}</TableCell>
                                        <TableCell>
                                            {profesor.estado ? (
                                                <Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20">
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-zinc-500 border-zinc-700">
                                                    Inactivo
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {profesor.materias && profesor.materias.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {profesor.materias.map((m) => (
                                                        <Badge key={m.id} variant="outline" className="text-xs">
                                                            {m.codigo}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Sin materias</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" asChild>
                                                    <Link href={`/profesores/${profesor.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    onClick={() => eliminar(profesor.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300" asChild>
                                                    <Link href={`/profesores/${profesor.id}`}>
                                                        <Book className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {(!profesores?.data || profesores.data.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            No se encontraron profesores registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Paginación */}
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-4 text-sm text-muted-foreground">
                            <p>
                                Mostrando {profesores?.from ?? 0} a {profesores?.to ?? 0} de {profesores?.total ?? 0} profesores
                            </p>

                            <div className="flex items-center gap-1">
                                {profesores?.prev_page_url && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(profesores.prev_page_url!)}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Anterior
                                    </Button>
                                )}

                                {profesores?.links
                                    ?.filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
                                    .map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                        </Button>
                                    ))}

                                {profesores?.next_page_url && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(profesores.next_page_url!)}
                                        className="flex items-center gap-1"
                                    >
                                        Siguiente <ChevronRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}