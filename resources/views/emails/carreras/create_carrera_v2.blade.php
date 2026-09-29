@extends('emails.layout')
@section('content')

<p style="margin-top: 0; margin-bottom: 20px; font-size: 17px; color:
#111827;">
    Estimad@ <strong>{{ $data['name'] }}</strong>,
</p>
<p style="margin-top: 0; margin-bottom: 24px; color: #4b5563;">
    Se ha creado una nueva carrera, los datos son los siguientes:
</p>

<!-- Tabla/Tarjeta de datos de la carrera -->

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 6px; margin-bottom: 24px;
border: 1px solid #e2e8f0;">
    <tr>
        <td style="padding: 16px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color:
#64748b; text-transform: uppercase; font-weight: 600; letter-spacing:
0.5px;">Carrera</p>
            <p style="margin: 0; font-size: 16px; color: #0f172a;
font-weight: 500;">{{ $data['carrera_nombre'] }}</p>
        </td>
    </tr>
    <tr>
        <td style="padding: 0 20px 16px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color:
#64748b; text-transform: uppercase; font-weight: 600; letter-spacing:
0.5px;">Codigo</p>
            <p style="margin: 0; font-size: 16px; color: #0f172a;
font-weight: 500;">{{ $data['carrera_codigo'] }}</p>
        </td>
    </tr>
</table>

<!-- Alerta de seguridad -->

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444;
border-radius: 4px; margin-bottom: 0;">
    <tr>
        <td style="padding: 16px;">
            <p style="margin: 0; color: #991b1b; font-size: 14px;
font-weight: 500;">
                ⚠️ <strong>Importante:</strong> Si no ha realizado este
                cambio o no reconoce esta acción, contacte de inmediato al administrador del
                sistema.
            </p>
        </td>
    </tr>
</table>

@endsection