<?php
namespace App\Exports;
use App\Models\Carrera;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
class CarrerasExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithEvents
{
    use Exportable;
    protected $filters;
    // Recibimos los filtros validados desde el controlador
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }
    public function query(): Builder
    {
        // Reutilizamos la lógica de Eloquent sin ejecutar .get() o .paginate()
        return Carrera::with('materias')
            ->when(($this->filters['buscar'] ?? '') !== '', function ($query) {
                $query->where('nombre', 'like', "%{$this->filters['buscar']}%");
            })
            ->when(!empty($this->filters['materia']), function ($query) {
                $query->whereHas('materias', function ($q) {
                    $q->where('materias.id', $this->filters['materia']);
                });
            })
            ->orderBy($this->filters['orden'], $this->filters['direccion']);
    }
    // Definimos las columnas que tendrá el Excel
    public function headings(): array
    {
        return [
            'Código',
            'Nombre de la Carrera',
            'Estado',
            'Materias Asignadas'
        ];
    }
    // Mapeamos los datos de cada Carrera.
    // $carrera ya trae cargadas sus materias gracias al Eager Loading (with)
    public function map($carrera): array
    {
        // Transformamos la colección de materias a un string separado por comas
        $materiasString = $carrera->materias->pluck('nombre')->implode(', ');

        return [
            $carrera->codigo,
            $carrera->nombre,
            $carrera->estado === 0 ? "Inactiva": "Activa",
            $materiasString,
        ];
    }

    public function styles(Worksheet $sheet):array
    {
        return [
            // Estilo para la primera fila (encabezados) si usas WithHeadings
            1 => ['font' => ['bold' => true], 'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],],     
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $cellRange = "A1:{$highestColumn}{$highestRow}";

                // 1. Autoajustar el ancho de las columnas según su contenido
                $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);
                for ($col = 1; $col <= $highestColumnIndex; $col++) {
                    $columnLetter = Coordinate::stringFromColumnIndex($col);
                    $sheet->getColumnDimension($columnLetter)->setAutoSize(true);
                }

                // 2. Aplicar el borde delgado a toda la tabla
                $sheet->getStyle($cellRange)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => 'FF000000'],
                        ],
                    ],
                ]);

                // 3. Iterar fila por fila para colorear según el Estado
                for ($row = 2; $row <= $highestRow; $row++) {
                    $estado = $sheet->getCell("C{$row}")->getValue();

                    $colorArgb = '';
                    if ($estado === 'Activa') {
                        $colorArgb = 'FFD4EDDA'; // Verde suave
                    } elseif ($estado === 'Inactiva') {
                        $colorArgb = 'FFF8D7DA'; // Rojo/Rosa suave
                    }

                    if ($colorArgb !== '') {
                        $sheet->getStyle("A{$row}:{$highestColumn}{$row}")->applyFromArray([
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['argb' => $colorArgb],
                            ],
                        ]);
                    }
                }
            },
        ];
    }
}

