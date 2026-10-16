import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export default function Show({ role }: { role: Role }) {
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Detalle del Rol</CardTitle>
                    <CardDescription>Información del rol y accesos asociados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground block mb-1">Nombre Interno</span>
                        <p className="text-xl font-medium">{role.name}</p>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-muted-foreground block">Permisos Habilitados</span>
                        {role.permissions.length === 0 ? (
                            <p className="text-sm italic text-muted-foreground">Este rol no cuenta con ningún permiso asignado.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {role.permissions.map((permission) => (
                                    <div key={permission.id} className="p-2 border rounded text-sm bg-muted/30">
                                        🛡️ {permission.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t justify-end">
                        <Button variant="outline" asChild>
                            <Link href={'/roles'}>Volver al listado</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/roles/${role.id}/edit`}>Ir a Editar</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
