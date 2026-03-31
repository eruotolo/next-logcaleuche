// Retorna el monto de la tarifa asignada al usuario,
// o 45.000 (Tarifa Estándar) si no tiene tarifa asignada.
export function getCuotaMensual(tarifaMonto: number | null | undefined): number {
    return tarifaMonto ?? 45000;
}
