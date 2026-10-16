import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Componente shadcn/ui para insignias estéticas
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[]; // Roles asignados mediante Spatie
}

interface IndexProps {
    users: User[];
}

export default function Index({ users }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

// Estados para el Modal de Confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
    setIdSeleccionado(id);
    setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/users/${idSeleccionado}`, {
        onSuccess: () => {
            setIsModalOpen(false);
            setIdSeleccionado(null);
        },
        onFinish: () => setIsDeleting(false),
        });
  };

    // Filtrado interactivo por Nombre, Email o Roles asignados
    const filteredUsers = users.filter((user) => {
        const matchesName = user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEmail = user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = user.roles.some(role => 
            role.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesName || matchesEmail || matchesRole;
    });

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usuarios y Roles</h1>
                    <p className="text-sm text-muted-foreground">
                        Administra las cuentas de usuario y sus niveles de acceso globales.
                    </p>
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <Link href={'/users/create'}>
                     <Plus className="w-4 h-4 mr-2" />
                    Registrar Usuario
                </Link>
                </Button>
            </div>

            {/* Herramientas de búsqueda */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2 max-w-md">
                    <Input
                        placeholder="Buscar por nombre, email o rol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10"
                    />
                    {searchQuery && (
                        <Button 
                            variant="ghost" 
                            onClick={() => setSearchQuery('')}
                            className="h-10 px-3"
                        >
                            Limpiar
                        </Button>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    Mostrando <strong>{filteredUsers.length}</strong> de {users.length} usuarios
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="border rounded-md bg-white shadow-sm">
                <FlashMessage />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Nombre / Email</TableHead>
                            <TableHead>Roles Asignados</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No se encontraron usuarios que coincidan con los criterios.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium text-muted-foreground">#{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.roles.length === 0 ? (
                                                <span className="text-xs italic text-muted-foreground">Sin roles asignados</span>
                                            ) : (
                                                user.roles.map(role => (
                                                    <Badge key={role.id} variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
                                                        💼 {role.name}
                                                    </Badge>
                                                ))
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                                        {/* Botón Ver */}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-slate-600 hover:text-slate-900"
                                            title="Ver detalles del rol"
                                        >
                                            <Link href={`/users/${user.id}`}>
                                            <Eye className="w-4 h-4 mr-1.5" />
                                            Ver
                                            </Link>
                                        </Button>
                                        {/* Botón Editar */}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                                            title="Editar rol"
                                            >
                                            <Link href={`/users/${user.id}/edit`}>
                                                <Pencil className="w-4 h-4 mr-1.5" />
                                                Editar
                                            </Link>
                                        </Button>

                                        {/* Botón Eliminar */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(user.id)}
                                            className="h-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                                            title="Eliminar usuario"
                                            >
                                            <Trash2 className="w-4 h-4 mr-1.5" />
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 🛑 MODAL DE CONFIRMACIÓN CON SHADCN/UI */}
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-50 text-red-600 rounded-full">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <AlertDialogTitle className="text-xl">¿Eliminar usuario?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    Estás a punto de borrar este usuario permanentemente. 
                    Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel 
                    disabled={isDeleting}
                    onClick={() => setIsModalOpen(false)}
                    >
                    Volver
                    </AlertDialogCancel>
                    <AlertDialogAction
                    disabled={isDeleting}
                    onClick={(e) => {
                        e.preventDefault(); // Controlamos el cierre de forma manual durante el procesamiento
                        ejecutarEliminacion();
                    }}
                    //className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs transition-colors duration-200"
                    >
                    {isDeleting ? (
            <div className="flex items-center justify-center gap-2">
            {/* 🔄 El spinner animado */}
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Eliminando...</span>
            </div>
        ) : (
            "Sí, eliminar usuario"
        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
