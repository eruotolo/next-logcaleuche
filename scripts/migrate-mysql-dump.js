#!/usr/bin/env node
/**
 * migrate-mysql-dump.js
 * ─────────────────────────────────────────────────────────────
 * Lee el backup MySQL (db-backup.sql) y migra los datos a PostgreSQL
 * de producción. No requiere un servidor MySQL corriendo.
 *
 * Pre-requisitos:
 *   1. npm install pg           (solo la primera vez)
 *   2. npx prisma migrate dev   (las tablas deben existir en PostgreSQL)
 *
 * Uso:
 *   node scripts/migrate-mysql-dump.js
 * ─────────────────────────────────────────────────────────────
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────
const DUMP_FILE = path.resolve(__dirname, 'db_backup.sql');

const PG = {
    host: 'localhost',
    port: 5432,
    user: 'eruotolo',
    password: 'Guns026772',
    database: 'dbcaleuche',
};

/** Tablas a omitir (legacy sin uso) */
const SKIP = new Set(['files', 'evento']);

/**
 * Orden de inserción respetando claves foráneas.
 * Las tablas padre deben ir antes que las hijas.
 */
const ORDER = [
    'grado', // sin deps
    'user_category', // sin deps
    'oficiales', // sin deps
    'categoryevent', // sin deps
    'categoryfeed', // sin deps
    'noticias_category', // sin deps
    'entradamotivo', // sin deps
    'salidamotivo', // sin deps
    'users', // → grado, user_category, oficiales
    'feed', // → users, categoryfeed
    'commentsfeed', // → users, feed
    'evento', // → categoryevent
    'acta', // → grado
    'biblioteca', // → grado
    'boletin', // → grado
    'trazado', // → users, grado
    'noticias', // → users, noticias_category
    'documents', // sin deps
    'message', // → users
    'entradadinero', // → users, entradamotivo
    'salidadinero', // → users, salidamotivo
];

// ─── PARSER DE VALORES MYSQL ──────────────────────────────────

/**
 * Parsea el bloque VALUES de un INSERT MySQL.
 * Soporta: strings con \' y \\ , NULL, enteros, decimales, fechas.
 * Retorna array de arrays: [ [val, val, ...], [val, val, ...] ]
 */
function parseMysqlValues(valuesBlock) {
    const rows = [];
    let i = 0;
    const len = valuesBlock.length;

    function skip() {
        while (i < len && /[\s,]/.test(valuesBlock[i])) i++;
    }

    function readString() {
        i++; // saltar comilla de apertura
        let s = '';
        while (i < len) {
            const c = valuesBlock[i];
            if (c === '\\') {
                i++;
                if (i >= len) break;
                const esc = valuesBlock[i];
                if (esc === 'n') s += '\n';
                else if (esc === 'r') s += '\r';
                else if (esc === 't') s += '\t';
                else if (esc === "'") s += "'";
                else if (esc === '"') s += '"';
                else if (esc === '\\') s += '\\';
                else if (esc === '0') s += '\0';
                else s += esc;
                i++;
            } else if (c === "'" && valuesBlock[i + 1] === "'") {
                s += "'";
                i += 2;
            } else if (c === "'") {
                i++; // saltar comilla de cierre
                break;
            } else {
                s += c;
                i++;
            }
        }
        return s;
    }

    function readValue() {
        // NULL
        if (valuesBlock.substring(i, i + 4).toUpperCase() === 'NULL') {
            i += 4;
            return null;
        }
        // String
        if (valuesBlock[i] === "'") {
            return readString();
        }
        // Número u otro sin comillas
        let raw = '';
        while (
            i < len &&
            valuesBlock[i] !== ',' &&
            valuesBlock[i] !== ')' &&
            !/\n/.test(valuesBlock[i])
        ) {
            raw += valuesBlock[i++];
        }
        raw = raw.trim();
        if (raw === '' || raw.toUpperCase() === 'NULL') return null;
        // Intentar parsear número
        if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
        return raw;
    }

    function readRow() {
        if (valuesBlock[i] !== '(') return null;
        i++; // saltar (
        const row = [];
        while (i < len) {
            while (i < len && /\s/.test(valuesBlock[i])) i++;
            if (valuesBlock[i] === ')') {
                i++;
                break;
            }
            if (valuesBlock[i] === ',') {
                i++;
                continue;
            }
            row.push(readValue());
        }
        return row;
    }

    while (i < len) {
        skip();
        if (i >= len) break;
        if (valuesBlock[i] === '(') {
            const row = readRow();
            if (row && row.length > 0) rows.push(row);
        } else {
            i++;
        }
    }

    return rows;
}

/**
 * Encuentra la posición del ';' que termina un INSERT, ignorando ';' dentro de strings.
 */
function findStatementEnd(str, start) {
    let i = start;
    let inStr = false;
    while (i < str.length) {
        const c = str[i];
        if (inStr) {
            if (c === '\\') {
                i += 2; // saltar secuencia de escape
                continue;
            }
            if (c === "'" && str[i + 1] === "'") {
                i += 2; // quote escapado ''
                continue;
            }
            if (c === "'") inStr = false;
        } else {
            if (c === "'") inStr = true;
            else if (c === ';') return i;
        }
        i++;
    }
    return str.length;
}

/**
 * Extrae todos los INSERT de una tabla del dump MySQL.
 * Retorna array de { columns: string[], rows: any[][] }
 */
function extractTable(dump, table) {
    const results = [];
    // Encuentra el encabezado: INSERT INTO `table` (cols) VALUES
    const headerRe = new RegExp(`INSERT INTO \`${table}\` \\(([^)]+)\\) VALUES\\s*`, 'g');
    let match;
    while ((match = headerRe.exec(dump)) !== null) {
        const columns = [...match[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
        const valuesStart = match.index + match[0].length;
        const valuesEnd = findStatementEnd(dump, valuesStart);
        const valuesBlock = dump.substring(valuesStart, valuesEnd);
        const rows = parseMysqlValues(valuesBlock);
        if (columns.length && rows.length) {
            results.push({ columns, rows });
        }
    }
    return results;
}

// ─── INSERCIÓN ────────────────────────────────────────────────

async function insertTable(client, table, batches) {
    if (!batches.length) {
        console.log(`  ↳ ${table}: sin datos`);
        return;
    }

    let total = 0;
    let errors = 0;

    for (const { columns, rows } of batches) {
        const colList = columns.map((c) => `"${c}"`).join(', ');

        for (const row of rows) {
            const placeholders = row.map((_, k) => `$${k + 1}`).join(', ');
            const sql = `INSERT INTO "${table}" (${colList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
            try {
                await client.query(sql, row);
                total++;
            } catch (err) {
                errors++;
                if (errors <= 3) {
                    console.error(`    ✗ ${table}: ${err.message.split('\n')[0]}`);
                }
            }
        }
    }

    const status = errors ? ` (${errors} errores)` : '';
    console.log(`  ✓ ${table}: ${total} filas${status}`);
}

// ─── SECUENCIAS ───────────────────────────────────────────────

async function resetSequences(client) {
    console.log('\n→ Actualizando secuencias...');

    // Pares [tabla, columna_pk] con autoincrement
    const seqs = [
        ['acta', 'id_Acta'],
        ['biblioteca', 'id_Libro'],
        ['boletin', 'id_Boletin'],
        ['categoryevent', 'id_Category'],
        ['categoryfeed', 'id_Category'],
        ['commentsfeed', 'id_Comment'],
        ['documents', 'id_Doc'],
        ['entradadinero', 'id_Entrada'],
        ['feed', 'id_Feed'],
        ['grado', 'id'],
        ['message', 'id_Message'],
        ['noticias', 'id_Noticia'],
        ['noticias_category', 'id_Categoria'],
        ['salidadinero', 'id_Salida'],
        ['trazado', 'id_Trazado'],
        ['users', 'id'],
        ['user_category', 'id_Cat'],
    ];

    for (const [table, col] of seqs) {
        try {
            await client.query(
                `SELECT setval(
           pg_get_serial_sequence('"${table}"', '${col}'),
           COALESCE((SELECT MAX("${col}") FROM "${table}"), 1)
         )`,
            );
        } catch {
            // No todas las tablas tienen secuencias
        }
    }
    console.log('  ✓ Secuencias actualizadas');
}

// ─── MAIN ─────────────────────────────────────────────────────

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Migración: MySQL dump → PostgreSQL producción');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 1. Cargar dump
    if (!fs.existsSync(DUMP_FILE)) {
        console.error(`\n✗ Archivo no encontrado: ${DUMP_FILE}`);
        process.exit(1);
    }
    const dump = fs.readFileSync(DUMP_FILE, 'utf8');
    console.log(`\n→ Dump cargado: ${(dump.length / 1024).toFixed(1)} KB`);

    // 2. Conectar a PostgreSQL
    const client = new Client(PG);
    try {
        await client.connect();
        console.log(`→ PostgreSQL: ${PG.user}@${PG.host}:${PG.port}/${PG.database}\n`);
    } catch (err) {
        console.error(`\n✗ No se pudo conectar a PostgreSQL: ${err.message}`);
        console.error(
            '  Verifica que PostgreSQL esté corriendo y que las credenciales sean correctas.',
        );
        process.exit(1);
    }

    // 3. Deshabilitar FKs temporalmente para inserción limpia
    try {
        await client.query('SET session_replication_role = replica');
    } catch {
        // Requiere superuser; si falla, confiamos en el orden de inserción
        console.log('  (FK desactivación omitida — usando orden FK-safe)\n');
    }

    // 4. Insertar tablas en orden
    console.log('→ Insertando datos...\n');
    for (const table of ORDER) {
        if (SKIP.has(table)) {
            console.log(`  ⊘ ${table}: omitida`);
            continue;
        }
        const batches = extractTable(dump, table);
        await insertTable(client, table, batches);
    }

    // 5. Restaurar FKs
    try {
        await client.query('SET session_replication_role = DEFAULT');
    } catch {
        // ignorar
    }

    // 6. Resetear secuencias
    await resetSequences(client);

    await client.end();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✓ Migración completada exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((err) => {
    console.error('\n✗ Error fatal:', err.message);
    process.exit(1);
});
