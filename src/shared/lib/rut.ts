/**
 * Removes dots, hyphens and spaces from a Chilean RUT string.
 * Input:  "27.039.635-6" | "27039635-6" | "270396356"
 * Output: "270396356"
 */
export function cleanRut(rut: string): string {
    return rut.replace(/[.\-\s]/g, '');
}

/**
 * Formats a Chilean RUT with dots and hyphen as the user types.
 * Input:  "270396356" | "27039635-6" | "27.039.635-6"
 * Output: "27.039.635-6"
 */
export function formatRut(rut: string): string {
    const clean = rut.replace(/[^\dkK]/g, '');
    if (clean.length <= 1) return clean;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toLowerCase();
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedBody}-${dv}`;
}
