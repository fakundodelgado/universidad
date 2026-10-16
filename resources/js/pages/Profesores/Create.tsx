import { Head, Link, useForm } from '@inertiajs/react';
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { ArrowLeft, UserPlus, BookOpen, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
}

interface Props {
    materias: Materia[];
}

export default function Create({ materias }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        dni: '',
        apellido: '',
        nombre: '',
        email: '',
        estado: true,
        foto: null as File | null,
        materias: [] as number[],
    });

    const [preview, setPreview] = useState<string | null>(null);

     const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('foto', file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const cambiarMateria = (id: number, seleccionada: boolean) => {
        if (seleccionada) {
            setData('materias', [...data.materias, id]);
        } else {
            setData(
                'materias',
                data.materias.filter((materiaId) => materiaId !== id)
            );
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/profesores');
    };

    return (
        <>
            <Head title="Nuevo Profesor" />

            <div className="flex-1 space-y-6 p-8 pt-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/profesores">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Nuevo Profesor</h2>
                        <p className="text-muted-foreground">Registrar un nuevo docente en el sistema.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-muted-foreground" />
                            Datos del Docente
                        </CardTitle>
                        <CardDescription>Complete los campos obligatorios para dar el alta.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">DNI</label>
                                <input
                                    type="text"
                                    value={data.dni}
                                    placeholder="Ej: 38123456"
                                    onChange={(e) => setData('dni', e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.dni && <p className="text-xs text-red-400">{errors.dni}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Apellido</label>
                                    <input
                                        type="text"
                                        value={data.apellido}
                                        placeholder="Ej: Gomez"
                                        onChange={(e) => setData('apellido', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                    {errors.apellido && <p className="text-xs text-red-400">{errors.apellido}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        placeholder="Ej: Juan Manuel"
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                    {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    placeholder="nombre@universidad.edu.ar"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                            </div>

                            {/* Campo Foto de Perfil */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Foto de Perfil</label>
                                <div className="flex items-center gap-4">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Previsualización"
                                            className="w-16 h-16 rounded-full object-cover border border-zinc-700 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="foto"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleFotoChange}
                                            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Formatos permitidos: JPG, PNG, WEBP. Máximo 2MB.
                                        </p>
                                    </div>
                                </div>
                                {errors.foto && <p className="text-xs text-red-400">{errors.foto}</p>}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="estado"
                                    type="checkbox"
                                    checked={data.estado}
                                    onChange={(e) => setData('estado', e.target.checked)}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="estado" className="text-sm font-medium cursor-pointer">
                                    Docente Activo
                                </label>
                            </div>

                            {/* Sección de Asignación de Materias */}
                            <div className="pt-4 border-t border-border space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        Asignación de Materias
                                    </label>
                                    <Badge variant="outline">{data.materias.length} seleccionadas</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-md border border-input bg-muted/20">
                                    {materias.map((materia) => (
                                        <label
                                            key={materia.id}
                                            className="flex items-center gap-2.5 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.materias.includes(materia.id)}
                                                onChange={(e) => cambiarMateria(materia.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>
                                                <strong className="font-mono text-xs text-muted-foreground">{materia.codigo}</strong> - {materia.nombre}
                                            </span>
                                        </label>
                                    ))}
                                    {materias.length === 0 && (
                                        <p className="text-xs text-muted-foreground col-span-2 text-center py-2">
                                            No hay materias registradas para asignar.
                                        </p>
                                    )}
                                </div>
                                {errors.materias && <p className="text-xs text-red-400">{errors.materias}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <Button variant="outline" type="button" asChild>
                                    <Link href="/profesores">Volver</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar Profesor'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}