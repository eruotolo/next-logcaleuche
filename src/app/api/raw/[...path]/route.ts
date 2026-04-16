import { inflateRawSync } from 'node:zlib';

import { v2 as cloudinary } from 'cloudinary';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/shared/lib/auth';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Extract the first file from a ZIP buffer (no external dependencies). */
function extractFirstFileFromZip(zip: Buffer): Buffer {
    // Find End of Central Directory Record (EOCD) — scan backwards for signature 0x06054b50
    let eocdOffset = -1;
    for (let i = zip.length - 22; i >= 0; i--) {
        if (zip.readUInt32LE(i) === 0x06054b50) {
            eocdOffset = i;
            break;
        }
    }
    if (eocdOffset === -1) throw new Error('Invalid ZIP: EOCD not found');

    // Read Central Directory offset from EOCD
    const cdOffset = zip.readUInt32LE(eocdOffset + 16);

    // Read first Central File Header (signature 0x02014b50)
    if (zip.readUInt32LE(cdOffset) !== 0x02014b50) throw new Error('Invalid ZIP: Central Directory header not found');

    const compressionMethod = zip.readUInt16LE(cdOffset + 10);
    const compressedSize = zip.readUInt32LE(cdOffset + 20);
    const localHeaderOffset = zip.readUInt32LE(cdOffset + 42);

    // Read Local File Header to find data start
    if (zip.readUInt32LE(localHeaderOffset) !== 0x04034b50) throw new Error('Invalid ZIP: Local header not found');
    const localFileNameLength = zip.readUInt16LE(localHeaderOffset + 26);
    const localExtraFieldLength = zip.readUInt16LE(localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;

    const data = zip.subarray(dataOffset, dataOffset + compressedSize);

    if (compressionMethod === 0) return Buffer.from(data);
    if (compressionMethod === 8) return inflateRawSync(data);
    throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { path } = await params;
    const publicId = path.join('/');
    const inline = request.nextUrl.searchParams.get('inline') === 'true';

    const archiveUrl = cloudinary.utils.download_zip_url({
        public_ids: [publicId],
        resource_type: 'raw',
        flatten_folders: true,
    });

    const upstream = await fetch(archiveUrl);
    if (!upstream.ok) {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const zipBuffer = Buffer.from(await upstream.arrayBuffer());
    const fileBuffer = extractFirstFileFromZip(zipBuffer);

    const fileName = publicId.split('/').pop() ?? 'document.pdf';
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    // Detect PDF by magic bytes (%PDF = 0x25 0x50 0x44 0x46) as fallback for files
    // uploaded before the roadmap that lack a .pdf extension in their public_id.
    const isPdfByMagic =
        fileBuffer[0] === 0x25 &&
        fileBuffer[1] === 0x50 &&
        fileBuffer[2] === 0x44 &&
        fileBuffer[3] === 0x46;
    const contentType = mimeTypes[ext] ?? (isPdfByMagic ? 'application/pdf' : 'application/octet-stream');
    const displayName = ext ? fileName : `${fileName}.pdf`;
    const disposition = inline ? 'inline' : `attachment; filename="${displayName}"`;

    return new Response(new Uint8Array(fileBuffer), {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': disposition,
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'private, max-age=3600',
        },
    });
}
