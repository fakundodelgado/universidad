import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Componentes adicionales opcionales de shadcn para refinar la UX (Select)
// Si no tienes el select instalado de shadcn corre: npx shadcn@latest add select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface IndexProps {
    permissions: Permission[];
}

export default function Index({ permissions }: IndexProps) {
    
    // Estados para los filtros reactivos
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    // Estado para controlar si estamos editando en línea
    const [editingId, setEditingId] = useState<number | null>(null);

    // Formulario de Inertia para Crear / Editar rápidamente
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
    });

    // Cambiar al modo edición precargando el string
    const startEdit = (permission: Permission) => {
        setEditingId(permission.id);
        setData('name', permission.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    // Envío del formulario (Sabe si es actualización o inserción)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/permissions/${editingId}`, {
                onSuccess: () => setEditingId(null)
            });
        } else {
            post('/permissions', {
                onSuccess: () => reset()
            });
        }
    };

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
        router.delete(`/permissions/${idSeleccionado}`, {
        onSuccess: () => {
            setIsModalOpen(false);
            setIdSeleccionado(null);
        },
        onFinish: () => setIsDeleting(false),
        });
    };

    // ==========================================
    // LÓGICA DE FILTRADO INTERACTIVO (CLIENT-SIDE)
    // ==========================================
    const filteredPermissions = permissions.filter((perm) => {
        const matchesSearch = perm.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (actionFilter === 'all') return matchesSearch;
        
        // Filtra de acuerdo al prefijo clásico de Spatie (ej: "view-", "create-")
        return matchesSearch && perm.name.toLowerCase().startsWith(actionFilter);
    });

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Permisos Atómicos del Sistema</h1>
                <p className="text-sm text-muted-foreground">
                    Lista de capacidades del sistema utilizadas para la protección de controladores y vistas.
                </p>
            </div>

            <FlashMessage />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* COLUMNA IZQUIERDA: Formulario dinámico de Alta/Edición */}
                
                    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">
                            {editingId ? '📝 Modificar Permiso' : '🛡️ Registrar Permiso'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Nombre Clave</label>
                                <Input 
                                    placeholder="Ej: listar carreras"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={processing}>
                                    {editingId ? 'Actualizar' : 'Guardar'}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={cancelEdit}>
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                {/* COLUMNA DERECHA: Tabla con Buscadores Avanzados */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* Barra de Filtros Interactivos */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:flex-1">
                            <Input
                                placeholder="Filtrar por nombre o módulo..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        
                        <div className="w-full sm:w-[180px]">
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Acción" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las acciones</SelectItem>
                                    <SelectItem value="listar">📋 Listar (index)</SelectItem>
                                    <SelectItem value="ver">👀 Lectura (show)</SelectItem>
                                    <SelectItem value="crear">➕ Inserción (create)</SelectItem>
                                    <SelectItem value="editar">✏️ Modificación (edit)</SelectItem>
                                    <SelectItem value="eliminar">🗑️ Eliminación (delete)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabla Shadcn */}
                    <div className="border rounded-md bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Identificador Interno</TableHead>
                                    <TableHead>Guard</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPermissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Ningún permiso coincide con los filtros aplicados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPermissions.map((perm) => (
                                        <TableRow key={perm.id} className="hover:bg-muted/40 transition-colors">
                                            <TableCell className="text-muted-foreground font-mono">#{perm.id}</TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded border border-indigo-100/60">
                                                    {perm.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {perm.guard_name}
                                            </TableCell>
                                            <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                                                                                <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => startEdit(perm)}
                                                        disabled={editingId === perm.id}
                                                    >
                                                        Editar
                                                    </Button>
                                                <Button 
                                                        variant="destructive" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(perm.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-right">
                        Resultados encontrados: <strong>{filteredPermissions.length}</strong> de {permissions.length}
                    </div>
                </div>
            </div>
                        {/* 🛑 MODAL DE CONFIRMACIÓN CON SHADCN/UI */}
                  <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-red-50 text-red-600 rounded-full">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <AlertDialogTitle className="text-xl">¿Eliminar permiso?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                          Estás a punto de borrar este permiso permanentemente. 
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
                "Sí, eliminar permiso"
              )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
        </div>
    );
}
