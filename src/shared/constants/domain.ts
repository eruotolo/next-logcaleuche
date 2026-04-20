// Constantes de dominio — fuente única de verdad para IDs fijos del sistema

export const CATEGORIA = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    COLABORADOR: 3,
    USUARIO: 4,
} as const;

export const OFICIALIDAD = {
    VENERABLE_MAESTRO: 2,
    SECRETARIO: 6,
    TESORERO: 7,
} as const;

export const TIPO_ACTIVIDAD = {
    TENIDA: 1,
    CAMARA: 2,
} as const;

export const MOTIVO_ENTRADA = {
    CUOTA_MENSUAL: 1,
    CAJA_HOSPITALARIA: 6,
} as const;

export const MOTIVO_SALIDA = {
    CAJA_HOSPITALARIA: 15,
} as const;

export const GRADO_LABEL: Record<number, string> = {
    1: 'Aprendiz',
    2: 'Compañero',
    3: 'Maestro',
} as const;

export const MESES_NOMBRE = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const;

