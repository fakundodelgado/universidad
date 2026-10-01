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
}

// Paleta de colores adaptada a modo oscuro
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard({ 
  metrics = { total_carreras: 0, carreras_activas: 0, total_materias: 0, total_profesores: 0 }, 
  carreras = [], 
  materiasPorAnio = [],
  materias = [] 
}: DashboardProps) {

  // Mapeo para el gráfico de barras
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
          {/* Gráfico de Barras */}


          {/* Tarjeta contenedora del gráfico de barras (ocupa 4 columnas en el grid) */}
            <Card className="col-span-4">
              {/* Encabezado de la tarjeta con título y descripción */}
              <CardHeader>
                <CardTitle>Materias por Carrera</CardTitle>
                <CardDescription>Cantidad de asignaturas vinculadas a cada plan</CardDescription>
              </CardHeader>
              
              {/* Cuerpo principal de la tarjeta */}
              <CardContent>
                {/* Contenedor con altura fija e igual ancho para el gráfico */}
                <div className="h-72 w-full">
                  {/* Hace que el gráfico adapte automáticamente su tamaño al contenedor padre */}
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Gráfico de barras alimentado por barChartData */}
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      {/* Grilla de fondo con líneas punteadas para facilitar la lectura */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      
                      {/* Eje X: Muestra el código/nombre de la carrera */}
                      <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                      
                      {/* Eje Y: Muestra la escala numérica (solo números enteros) */}
                      <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                      
                      {/* Tooltip flotante con estilos personalizados para modo oscuro */}
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fafafa', fontWeight: 600 }}
                      />
                      
                      {/* Configuración de las barras: campo de datos, color azul y bordes superiores redondeados */}
                      <Bar dataKey="materias" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Materias" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>



          {/* Gráfico de Torta / Donut */}
         {/* Tarjeta contenedora del gráfico de dona (ocupa 3 columnas en la grilla) */}
        <Card className="col-span-3">
          {/* Encabezado de la tarjeta con título y descripción */}
          <CardHeader>
            <CardTitle>Materias por Año</CardTitle>
            <CardDescription>Distribución curricular por nivel académico</CardDescription>
          </CardHeader>
          
          {/* Cuerpo principal de la tarjeta */}
          <CardContent>
            {/* Contenedor con altura fija e igual ancho para el gráfico */}
            <div className="h-72 w-full">
              {/* Mantiene la adaptabilidad del gráfico al tamaño del contenedor padre */}
              <ResponsiveContainer width="100%" height="100%">
                {/* Componente principal para gráficos circulares */}
                <PieChart>
                  {/* Configuración de la estructura del gráfico circulares/dona */}
                  <Pie
                    data={materiasPorAnio}             /* Fuente de datos (ej: [{ name: 'Año 1', value: 10 }]) */
                    cx="50%"                            /* Posición X centrada */
                    cy="50%"                            /* Posición Y centrada */
                    innerRadius={55}                    /* Radio interno para crear el hueco de la dona */
                    outerRadius={80}                    /* Radio externo de las porciones */
                    paddingAngle={5}                    /* Espaciado en grados entre cada sección */
                    dataKey="value"                     /* Propiedad que contiene el valor numérico */
                  >
                    {/* Iteración para aplicar colores únicos a cada porción */}
                    {materiasPorAnio.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_COLORS[index % PIE_COLORS.length]} /* Alterna colores del array PIE_COLORS */
                      />
                    ))}
                  </Pie>
                  
                  {/* Tooltip flotante con diseño adaptado a modo oscuro */}
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fafafa' }}
                  />
                  
                  {/* Leyenda inferior que relaciona los colores con los nombres/años */}
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </div>

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