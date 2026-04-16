// Pure server-side TOTP utilities — no 'use server' directive
// (this file is imported by Server Actions, not called directly from the client)

import bcrypt from 'bcryptjs';
import * as OTPAuth from 'otpauth';
import * as QRCode from 'qrcode';

import { BCRYPT_ROUNDS } from '@/shared/lib/auth';

const ISSUER = 'Logia Caleuche 250';

/** Generate a new base32 TOTP secret. */
export function generateSecret(): string {
    const totp = new OTPAuth.TOTP({
        issuer: ISSUER,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
    });
    return totp.secret.base32;
}

/** Build the otpauth:// URI and convert it to a QR code data URL. */
export async function generateQRDataUrl(secret: string, email: string): Promise<string> {
    const totp = new OTPAuth.TOTP({
        issuer: ISSUER,
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
    });
    return QRCode.toDataURL(totp.toString());
}

/** Validate a 6-digit TOTP token (window = ±1 period = 90 s tolerance). */
export function verifyTOTP(secret: string, token: string): boolean {
    const totp = new OTPAuth.TOTP({
        issuer: ISSUER,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
    });
    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
}

/** Generate `count` random alphanumeric backup codes (8 chars, uppercase). */
export function generateBackupCodes(count = 8): string[] {
    return Array.from({ length: count }, () =>
        crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase(),
    );
}

/** Hash each backup code with bcrypt for safe storage. */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
    return Promise.all(codes.map((c) => bcrypt.hash(c, BCRYPT_ROUNDS)));
}

/**
 * Compare a plain backup code against the stored hashes.
 * Returns the index of the matching hash, or -1 if none match.
 */
export async function verifyBackupCode(plain: string, hashes: string[]): Promise<number> {
    const results = await Promise.all(hashes.map((h) => bcrypt.compare(plain, h)));
    return results.findIndex(Boolean);
}
