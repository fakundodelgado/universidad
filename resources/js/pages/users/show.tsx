import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface ShowProps {
    user: User;
    permissions: Permission[]; // Todos los permisos que tiene el usuario (vía roles)
}

export default function Show({ user, permissions }: ShowProps) {
    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Ficha del Usuario</CardTitle>
                    <CardDescription>Detalle de identidad y accesos de seguridad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Información Básica */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Nombre Completo</span>
                            <p className="text-lg font-medium text-foreground">{user.name}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Dirección de Email</span>
                            <p className="text-lg font-medium text-foreground">{user.email}</p>
                        </div>
                    </div>

                    {/* Roles Activos */}
                    <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Roles Asignados</span>
                        <div className="flex flex-wrap gap-2">
                            {user.roles.length === 0 ? (
                                <p className="text-sm italic text-muted-foreground">Este usuario no posee roles asignados actualmente.</p>
                            ) : (
                                user.roles.map((role) => (
                                    <Badge key={role.id} variant="secondary" className="capitalize text-sm py-1 px-3">
                                        💼 {role.name}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Permisos Heredados directos */}
                    <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Capacidades de Sistema (Heredados de sus Roles)</span>
                        {permissions.length === 0 ? (
                            <p className="text-sm italic text-destructive">El usuario no tiene permisos efectivos. No podrá realizar acciones protegidas.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border rounded-md bg-muted/20">
                                {permissions.map((perm) => (
                                    <div key={perm.id} className="text-xs p-2 rounded bg-white border shadow-sm truncate text-muted-foreground">
                                        🛡️ {perm.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer con redirecciones */}
                    <div className="flex gap-2 pt-4 border-t justify-end">
                        <Button variant="outline" asChild>
                            <Link href={'/users'}>Volver al listado</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/users/${user.id}/edit`}>Modificar Accesos</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
