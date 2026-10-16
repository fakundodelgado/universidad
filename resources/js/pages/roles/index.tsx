import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Componente shadcn/ui
import { AlertTriangle, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import FlashMessage from '@/components/FlashMessage';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export default function Index({ roles }: { roles: Role[] }) {
    // 1. Estado para almacenar el término de búsqueda
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
        router.delete(`/roles/${idSeleccionado}`, {
        onSuccess: () => {
            setIsModalOpen(false);
            setIdSeleccionado(null);
        },
        onFinish: () => setIsDeleting(false),
        });
  };

    // 2. Lógica de filtrado interactivo en tiempo real
    const filteredRoles = roles.filter((role) => {
        const matchesRoleName = role.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Opcional: También busca si el término coincide con el nombre de algún permiso dentro del rol
        const matchesPermission = role.permissions.some(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesRoleName || matchesPermission;
    });

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
                  {/* Encabezado Principal */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Roles</h1>
                <p className="text-sm text-gray-500 mt-1">Gestión y listado de los roles del sistema.</p>
                </div>
                
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <Link href="/roles/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo rol
                </Link>
                </Button>
            </div>

            {/* 3. Barra de herramientas con el buscador interactivo */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2 max-w-md">
                    <Input
                        placeholder="Buscar por rol o permiso..."
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
                    Mostrando <strong>{filteredRoles.length}</strong> de {roles.length} roles
                </div>
            </div>

            {/* 4. Tabla de Datos */}
            <div className="border rounded-md bg-white shadow-sm">
                <FlashMessage />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Nombre del Rol</TableHead>
                            <TableHead>Permisos Asignados</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No se encontraron roles que coincidan con la búsqueda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRoles.map((role) => (
                                <TableRow key={role.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium text-muted-foreground">#{role.id}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{role.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xl">
                                            {role.permissions.map(p => (
                                                <span 
                                                    key={p.id} 
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border"
                                                >
                                                    {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                                       {/*} <Button variant="outline" size="sm" asChild>
                                            <Link href={route('roles.show', role.id)}>Ver</Link>
                                        </Button>
                                        */}
                                        {/* Botón Ver */}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-slate-600 hover:text-slate-900"
                                            title="Ver detalles del rol"
                                        >
                                            <Link href={`/roles/${role.id}`}>
                                            <Eye className="w-4 h-4 mr-1.5" />
                                            Ver
                                            </Link>
                                        </Button>
                                        {/*}
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('roles.edit', role.id)}>Editar</Link>
                                        </Button>
                                        */}

                                                                {/* Botón Editar */}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                                            title="Editar rol"
                                            >
                                            <Link href={`/roles/${role.id}/edit`}>
                                                <Pencil className="w-4 h-4 mr-1.5" />
                                                Editar
                                            </Link>
                                        </Button>

                                        {/* Botón Eliminar */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(role.id)}
                                            className="h-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                                            title="Eliminar rol"
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
              <AlertDialogTitle className="text-xl">¿Eliminar rol?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Estás a punto de borrar este rol permanentemente. 
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
    "Sí, eliminar rol"
  )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
    );
}
