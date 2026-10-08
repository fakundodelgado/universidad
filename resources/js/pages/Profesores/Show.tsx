import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Mail, IdCard, Pencil, User, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Materia {
    id: number;
    codigo: string;
    nombre: string;
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

interface Props {
    profesor: Profesor;
}

export default function Show({ profesor }: Props) {
    return (
        <>
            <Head title={`Docente: ${profesor?.apellido}, ${profesor?.nombre}`} />

            <div className="flex-1 space-y-6 p-8 pt-6 max-w-3xl mx-auto">
                {/* Header con botón de volver y acciones */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/profesores">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {profesor?.apellido}, {profesor?.nombre}
                            </h2>
                            <p className="text-muted-foreground">Perfil detallado del docente y materias asignadas.</p>
                        </div>
                    </div>

                    <Button asChild variant="outline">
                        <Link href={`/profesores/${profesor?.id}/edit`} className="flex items-center gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta de Información General */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Información Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <IdCard className="h-3.5 w-3.5" /> DNI
                                </span>
                                <p className="font-mono text-sm font-semibold">{profesor?.dni}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" /> Correo Electrónico
                                </span>
                                <p className="text-sm truncate">{profesor?.email}</p>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-border">
                                <span className="text-xs font-medium text-muted-foreground">Estado del Docente</span>
                                <div>
                                    {profesor?.estado ? (
                                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 flex items-center w-fit gap-1 mt-1">
                                            <CheckCircle2 className="h-3 w-3" /> Activo
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-zinc-500 border-zinc-700 flex items-center w-fit gap-1 mt-1">
                                            <XCircle className="h-3 w-3" /> Inactivo
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Materias Asignadas */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    Materias Asignadas
                                </CardTitle>
                                <Badge variant="secondary">
                                    {profesor?.materias?.length ?? 0} materias
                                </Badge>
                            </div>
                            <CardDescription>
                                Asignaturas vinculadas al plan de estudio del profesor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profesor?.materias && profesor.materias.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2.5">
                                    {profesor.materias.map((materia) => (
                                        <div
                                            key={materia.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                                        >
                                            <span className="text-sm font-medium">{materia.nombre}</span>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {materia.codigo}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border">
                                    <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                    <p className="text-sm font-medium text-muted-foreground">No tiene materias asignadas</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        Puede asignarle materias desde la pantalla de edición.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}