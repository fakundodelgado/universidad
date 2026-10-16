import { useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface EditProps {
    role: Role;
    permissions: Permission[];
    rolePermissions: string[];
}

export default function Edit({ role, permissions, rolePermissions }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    const handleCheckboxChange = (name: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, name]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== name));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Rol: {role.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Rol</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label>Modificar Permisos</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/40">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={data.permissions.includes(permission.name)}
                                            onCheckedChange={(checked) => handleCheckboxChange(permission.name, !!checked)}
                                        />
                                        <Label htmlFor={`perm-${permission.id}`} className="font-normal cursor-pointer">
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" asChild>
                                <Link href={'/roles'}>Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>Actualizar Rol</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
