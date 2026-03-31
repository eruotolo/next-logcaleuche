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
