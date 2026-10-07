import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Componentes de Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  anio: number;
  cuatrimestre: number;
  carreras?: { id: number; codigo: string }[];
  profesores?: { id: number; nombre: string; apellido: string }[];
}

interface Carrera {
  id: number;
  codigo: string;
  nombre: string;
  estado: boolean;
  materias_count?: number;
}

interface DistribucionAnio {
  name: string;
  value: number;
}

// Interfaz para la actividad práctica (Profesores por Materia)
interface ProfesorPorMateria {
  nombre: string;
  profesores: number;
}

interface DashboardProps {
  metrics?: {
    total_carreras: number;
    carreras_activas: number;
    total_materias: number;
    total_profesores: number;
  };
  carreras?: Carrera[];
  materiasPorAnio?: DistribucionAnio[];
  materias?: Materia[];
  profesoresPorMateria?: ProfesorPorMateria[];
}

// Paleta de colores adaptada a modo oscuro
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard({ 
  metrics = { total_carreras: 0, carreras_activas: 0, total_materias: 0, total_profesores: 0 }, 
  carreras = [], 
  materiasPorAnio = [],
  materias = [],
  profesoresPorMateria = []
}: DashboardProps) {

  // Mapeo para el gráfico de materias por carrera
  const barChartData = carreras.map((c) => ({
    name: c.codigo,
    materias: c.materias_count ?? 0,
    nombreCompleto: c.nombre,
  }));

  return (
    <AppLayout>
      <Head title="Dashboard Universitario" />

      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Panel de Control Universitario</h2>
            <p className="text-muted-foreground">
              Resumen de carreras, materias y cuerpo docente.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/carreras/create">Nueva Carrera</Link>
            </Button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carreras Totales</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total_carreras}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.carreras_activas} activas en oferta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias Registradas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total_materias}</div>
              <p className="text-xs text-muted-foreground">Asignadas a planes de estudio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docentes Registrados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total_profesores}</div>
              <p className="text-xs text-muted-foreground">Profesores activos en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Relaciones sincronizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Gráficos (Barras + Torta) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico de Barras: Materias por Carrera */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Materias por Carrera</CardTitle>
              <CardDescription>Cantidad de asignaturas vinculadas a cada plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      labelStyle={{ color: '#fafafa', fontWeight: 600 }}
                    />
                    <Bar dataKey="materias" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Materias" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Torta / Donut: Materias por Año */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Materias por Año</CardTitle>
              <CardDescription>Distribución curricular por nivel académico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materiasPorAnio}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {materiasPorAnio.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PIE_COLORS[index % PIE_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fafafa' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TERCER GRÁFICO (ACTIVIDAD PRÁCTICA): Profesores por Materia */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profesores por Materia</CardTitle>
            <CardDescription>
              Cantidad de docentes asignados a cada cátedra (Relación N:M)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profesoresPorMateria} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="nombre" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#fafafa', fontWeight: 600 }}
                    formatter={(value: any) => [`${value} asignados`, 'Profesores']}
                  />
                  <Bar dataKey="profesores" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Profesores" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tablas de Carreras y Materias */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Carreras</CardTitle>
                <CardDescription>Materias vinculadas por carrera</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/carreras" className="flex items-center gap-1">
                  Ver todas <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Materias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carreras.map((carrera) => (
                    <TableRow key={carrera.id}>
                      <TableCell className="font-semibold">{carrera.codigo}</TableCell>
                      <TableCell>{carrera.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {carrera.materias_count ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Materias y Asignaciones</CardTitle>
              <CardDescription>Cátedras y profesores a cargo (Relación N:M)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Carreras</TableHead>
                    <TableHead>Profesores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materias.map((materia) => (
                    <TableRow key={materia.id}>
                      <TableCell>
                        <div className="font-medium">{materia.nombre}</div>
                        <div className="text-xs text-muted-foreground">{materia.codigo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {materia.carreras?.map((c) => (
                            <Badge key={c.id} variant="outline" className="text-xs">
                              {c.codigo}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {materia.profesores && materia.profesores.length > 0 ? (
                            materia.profesores
                              .map((p) => `${p.apellido}, ${p.nombre[0]}.`)
                              .join(' · ')
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sin asignar</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}