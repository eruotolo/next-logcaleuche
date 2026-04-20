// Notification target filter: content grade → which users should be notified.
// grado 1 (Aprendiz) → all users (no filter)
// grado 2 (Compañero) → Compañeros and Maestros
// grado 3 (Maestro) → Maestros only
// null (universal content) → all users
export function buildGradoNotifyFilter(
    gradoId: number | null,
): { gradoId?: number | { in: number[] } } {
    if (gradoId === null || gradoId === 1) return {};
    if (gradoId === 2) return { gradoId: { in: [2, 3] } };
    return { gradoId: 3 };
}

// Returns true if a user with `userGrado` can access content with `contentGrado`.
// Universal content (null) is accessible by everyone.
export function canUserAccessGrado(userGrado: number, contentGrado: number | null): boolean {
    if (contentGrado === null) return true;
    return userGrado >= contentGrado;
}
