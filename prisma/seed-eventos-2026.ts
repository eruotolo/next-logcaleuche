import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const DATABASE_URL = 'postgresql://eruotolo:Guns026772@localhost:5432/dbcaleuche?schema=public';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const eventos = [
    // ── MARZO ──────────────────────────────────────────────────────────────
    {
        nombre: 'La Ética Masónica como principio orientador de la Caridad y la Inclusión',
        trabajo: 'Trazado',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 3 - 1, 5),
        gradoId: 1,
    },
    {
        nombre: 'Los viajes y sus contenidos Iniciáticos',
        trabajo: 'Trazado',
        autor: 'Q.H. Iván Segovia Barría',
        fecha: new Date(2026, 3 - 1, 12),
        gradoId: 2,
    },
    {
        nombre: 'La Búsqueda de la Verdad',
        trabajo: 'Trazado',
        autor: 'Q.H. Pedro Bravo Crisostomo',
        fecha: new Date(2026, 3 - 1, 19),
        gradoId: 1,
    },
    {
        nombre: 'Los cinco puntos perfectos de la Maestría',
        trabajo: 'Trazado',
        autor: 'Q.H. Pedro Martínez Barría',
        fecha: new Date(2026, 3 - 1, 26),
        gradoId: 3,
    },
    // ── ABRIL ──────────────────────────────────────────────────────────────
    {
        nombre: 'Tenida Administrativa',
        trabajo: 'Tenida Administrativa',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 4 - 1, 2),
        gradoId: 3,
    },
    {
        nombre: 'Tenida de Iniciación',
        trabajo: 'Tenida de Iniciación',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 4 - 1, 9),
        gradoId: 1,
    },
    {
        nombre: 'Integración Americana',
        trabajo: 'Trazado',
        autor: 'Q.H. Carlos Velásquez Cortes — Brindis: Q.H. Edgardo Ruotolo C. / Q.H. Mario Baquerizo A. / Q.H. Danny Franco F.',
        fecha: new Date(2026, 4 - 1, 16),
        gradoId: 1,
    },
    {
        nombre: 'La Expulsión del Templo',
        trabajo: 'Trazado',
        autor: 'Q.H. Fernando Durán Salas',
        fecha: new Date(2026, 4 - 1, 23),
        gradoId: 3,
    },
    {
        nombre: 'Las Herramientas del Compañero',
        trabajo: 'Trazado',
        autor: 'Q.H. Alvaro Aguila Seguel',
        fecha: new Date(2026, 4 - 1, 30),
        gradoId: 2,
    },
    // ── MAYO ───────────────────────────────────────────────────────────────
    {
        nombre: 'Exaltación del Trabajo Masónico',
        trabajo: 'Trazado',
        autor: 'Q.H. Boris Barra Uribe — Brindis: Q.H. Pablo Silva S. / Q.H. Ivan Segovia B. / Q.H. Alvaro Aguila S.',
        fecha: new Date(2026, 5 - 1, 7),
        gradoId: 1,
    },
    {
        nombre: 'Aumento de Salario',
        trabajo: 'Tenida de Aumento de Salario',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 5 - 1, 14),
        gradoId: 2,
    },
    {
        nombre: 'Tenida Administrativa',
        trabajo: 'Tenida Administrativa',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 5 - 1, 19),
        gradoId: 3,
    },
    {
        nombre: 'Aniversario CLXIV de la Gran Logia de Chile',
        trabajo: 'Tenida Jurisdiccional',
        autor: 'Tenida Jurisdiccional en Castro',
        fecha: new Date(2026, 5 - 1, 29),
        gradoId: 1,
    },
    // ── JUNIO ──────────────────────────────────────────────────────────────
    {
        nombre: 'La Escala de cinco gradas',
        trabajo: 'Trazado',
        autor: 'Q.H. Pablo Silva Silva',
        fecha: new Date(2026, 6 - 1, 4),
        gradoId: 2,
    },
    {
        nombre: 'Tercer Aniversario de R.L. Caleuche Nº250',
        trabajo: 'Aniversario',
        autor: 'Ex. VM. Francisco Torres Osorio — Brindis: Q.H. Juan Serra O. / 1VAd. Jorge Bustos C. / 2VAd. Fernando Duran S.',
        fecha: new Date(2026, 6 - 1, 11),
        gradoId: 1,
    },
    {
        nombre: 'Solsticio de Invierno',
        trabajo: 'Tenida Conjunta',
        autor: 'De Conjunto — R.L. Chiloé Nº120',
        fecha: new Date(2026, 6 - 1, 16),
        gradoId: 1,
    },
    {
        nombre: 'Los Malos Compañeros',
        trabajo: 'Trazado',
        autor: 'Q.H. Juan Serra Orellana',
        fecha: new Date(2026, 6 - 1, 26),
        gradoId: 3,
    },
    // ── JULIO ──────────────────────────────────────────────────────────────
    {
        nombre: 'La Estrella Flamígera',
        trabajo: 'Trazado',
        autor: 'Q.H. Ivan Segovia Barría',
        fecha: new Date(2026, 7 - 1, 2),
        gradoId: 2,
    },
    {
        nombre: 'El mandil y la banda del Maestro',
        trabajo: 'Trazado',
        autor: 'Q.H. Ramón Andrade Pinochet',
        fecha: new Date(2026, 7 - 1, 9),
        gradoId: 3,
    },
    {
        nombre: 'Tenida de Iniciación',
        trabajo: 'Tenida de Iniciación',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 7 - 1, 23),
        gradoId: 1,
    },
    {
        nombre: 'El Pan y el Agua',
        trabajo: 'Trazado',
        autor: 'Q.H. Luis Águila Alvarado',
        fecha: new Date(2026, 7 - 1, 30),
        gradoId: 1,
    },
    // ── AGOSTO ─────────────────────────────────────────────────────────────
    {
        nombre: 'La búsqueda de la palabra perdida',
        trabajo: 'Trazado',
        autor: 'Q.H. Edgardo Ruotolo Cardozo',
        fecha: new Date(2026, 8 - 1, 6),
        gradoId: 3,
    },
    {
        nombre: 'El cinco',
        trabajo: 'Trazado',
        autor: 'Q.H. C. a definir',
        fecha: new Date(2026, 8 - 1, 13),
        gradoId: 2,
    },
    {
        nombre: 'El Libro de San Juan; Capítulo 1, Versículo 1',
        trabajo: 'Trazado',
        autor: 'Q.H. Ignacio Montiel Andrade',
        fecha: new Date(2026, 8 - 1, 20),
        gradoId: 1,
    },
    {
        nombre: 'Reunión Blanca R.L. Caleuche Nº250',
        trabajo: 'Reunión Blanca',
        autor: 'Q.H. Fernando Durán Salas',
        fecha: new Date(2026, 8 - 1, 27),
        gradoId: 1,
    },
    // ── SEPTIEMBRE ─────────────────────────────────────────────────────────
    {
        nombre: 'La Teología',
        trabajo: 'Trazado',
        autor: 'Q.H. C. a definir',
        fecha: new Date(2026, 9 - 1, 3),
        gradoId: 2,
    },
    {
        nombre: 'Homenaje al Aniversario Patrio',
        trabajo: 'Trazado',
        autor: 'Q.H. Danny Franco Figuera — Brindis: Q.H. Luis Aguila A. / A. por definir / A. por definir',
        fecha: new Date(2026, 9 - 1, 10),
        gradoId: 1,
    },
    {
        nombre: '¿Hacia donde vamos?',
        trabajo: 'Trazado',
        autor: 'Q.H. Rubén Celis Schneider',
        fecha: new Date(2026, 9 - 1, 24),
        gradoId: 3,
    },
    // ── OCTUBRE ────────────────────────────────────────────────────────────
    {
        nombre: 'La Regularidad del Compás',
        trabajo: 'Trazado',
        autor: 'Q.H. Claudio Mella Chico',
        fecha: new Date(2026, 10 - 1, 1),
        gradoId: 1,
    },
    {
        nombre: 'La Gnoseología',
        trabajo: 'Trazado',
        autor: 'Q.H. Pablo Silva Silva',
        fecha: new Date(2026, 10 - 1, 8),
        gradoId: 2,
    },
    {
        nombre: 'La defensa y la propagación de la verdad',
        trabajo: 'Trazado',
        autor: 'Q.H. Juan Diaz Saldivia',
        fecha: new Date(2026, 10 - 1, 15),
        gradoId: 3,
    },
    {
        nombre: 'Ceremonia Homenaje a Servidores Públicos',
        trabajo: 'Ceremonia',
        autor: 'R.L. Caleuche Nº250',
        fecha: new Date(2026, 10 - 1, 22),
        gradoId: 1,
    },
    {
        nombre: 'Día de la Tolerancia',
        trabajo: 'Trazado',
        autor: 'Q.H. Héctor Cesar Muñoz B.',
        fecha: new Date(2026, 10 - 1, 29),
        gradoId: 1,
    },
    // ── NOVIEMBRE ──────────────────────────────────────────────────────────
    {
        nombre: 'Ceremonia de Exaltación',
        trabajo: 'Tenida de Exaltación',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 11 - 1, 5),
        gradoId: 3,
    },
    {
        nombre: 'Fiesta del Maestro — El Libro de Eclesiastés Cap.12, Ver. 1 y 7',
        trabajo: 'Fiesta del Maestro',
        autor: 'Q.H. Pedro Alvarez Rivera',
        fecha: new Date(2026, 11 - 1, 12),
        gradoId: 3,
    },
    {
        nombre: 'Fiesta del Compañero — Vamos por un Café',
        trabajo: 'Fiesta del Compañero',
        autor: 'Columna CC. De Conjunto',
        fecha: new Date(2026, 11 - 1, 19),
        gradoId: 2,
    },
    {
        nombre: 'Fiesta del Aprendiz — El Piso Mosaico',
        trabajo: 'Fiesta del Aprendiz',
        autor: 'Columna AA.',
        fecha: new Date(2026, 11 - 1, 26),
        gradoId: 1,
    },
    // ── DICIEMBRE ──────────────────────────────────────────────────────────
    {
        nombre: 'Conmemoración de la Declaración de los Derechos Humanos',
        trabajo: 'Tenida Conjunta',
        autor: 'De Conjunto — R.L. Estrella Insular Nº78',
        fecha: new Date(2026, 12 - 1, 3),
        gradoId: 1,
    },
    {
        nombre: 'Solsticio de Verano',
        trabajo: 'Tenida Solsticial',
        autor: 'Q.H. Jorge Bustos Cabrera — Brindis: Q.H. Ramon Andrade P. / Q.H. Mario Baquerizo A. / Q.H. Cristian Azocar V.',
        fecha: new Date(2026, 12 - 1, 10),
        gradoId: 1,
    },
    {
        nombre: 'Reunión Administrativa',
        trabajo: 'Tenida Administrativa',
        autor: 'VM. Cristian Torres Márquez',
        fecha: new Date(2026, 12 - 1, 17),
        gradoId: 3,
    },
];

async function main() {
    console.log('Iniciando seed de eventos 2026…');
    await prisma.evento.deleteMany({});
    console.log('Tabla evento limpiada.');

    for (const evento of eventos) {
        await prisma.evento.create({
            data: {
                nombre: evento.nombre,
                trabajo: evento.trabajo,
                autor: evento.autor,
                fecha: evento.fecha,
                gradoId: evento.gradoId,
                active: 1,
            },
        });
    }

    console.log(`✓ ${eventos.length} eventos creados correctamente.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
