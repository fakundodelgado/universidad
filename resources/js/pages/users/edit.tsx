import { useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface EditProps {
    user: User;
    roles: Role[];
    userRoles: string[]; // Nombres de los roles que ya posee el usuario
}

export default function Edit({ user, roles, userRoles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '', // En blanco por seguridad
        roles: userRoles,
    });

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter(r => r !== roleName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Editar Perfil y Roles: {user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Datos de perfil */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Modificar Contraseña (Opcional) */}
                        <div className="space-y-2 p-4 border rounded-md bg-amber-50/20 border-amber-200/40">
                            <Label htmlFor="password">Nueva Contraseña (Dejar en blanco para mantener la actual)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                        </div>

                        {/* Modificar Roles */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Gestionar Roles Asignados</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/30">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.name)}
                                            onCheckedChange={(checked) => handleCheckboxChange(role.name, !!checked)}
                                        />
                                        <Label htmlFor={`role-${role.id}`} className="font-normal capitalize cursor-pointer">
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.roles && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm
                            flex items-center gap-2 border border-destructive/20 animate-in fade-in-50
                            duration-200">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{errors.roles}</span>
                            </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 justify-end pt-4 border-t">
                            <Button variant="outline" asChild>
                                <Link href={'/users'}>Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>Actualizar Usuario</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
