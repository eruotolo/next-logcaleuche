// Constantes de dominio — fuente única de verdad para IDs fijos del sistema

export const GRADO = {
    APRENDIZ: 1,
    COMPANERO: 2,
    MAESTRO: 3,
} as const;

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

export const MOTIVO_ENTRADA = {
    CUOTA_MENSUAL: 1,
    CAJA_HOSPITALARIA: 6,
} as const;

export const MOTIVO_SALIDA = {
    CAJA_HOSPITALARIA: 15,
} as const;

export const TARIFA_CUOTA = {
    ESTANDAR: 45_000,
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

export const MESES_CON_NUMERO = [
    '01 - Enero', '02 - Febrero', '03 - Marzo', '04 - Abril',
    '05 - Mayo', '06 - Junio', '07 - Julio', '08 - Agosto',
    '09 - Septiembre', '10 - Octubre', '11 - Noviembre', '12 - Diciembre',
] as const;
