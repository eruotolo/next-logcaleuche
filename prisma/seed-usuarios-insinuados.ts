import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load DATABASE_URL from .env (Node 20+ built-in)
process.loadEnvFile('.env');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('Missing DATABASE_URL in .env');
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const DEFAULT_PASSWORD = 'Cambiar2024!';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function generateUniqueSlug(name: string, lastName: string): Promise<string> {
    const baseSlug = slugify(`${name} ${lastName}`);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const exists = await prisma.user.findFirst({ where: { slug } });
        if (!exists) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

const usuarios = [
    {
        username: '14088569-K',
        name: 'Eduardo Alberto',
        lastName: 'Perez Saldivia',
        email: 'edduaperez@gmail.com',
        dateBirthday: new Date(1981, 11 - 1, 30),
        address: 'Llicaldad S/N°',
        city: 'Castro',
        phone: '988210578',
        gradoId: 1,
        categoryId: 3,
    },
    {
        username: '14213915-4',
        name: 'Manuel Alejandro',
        lastName: 'Carrasco Peña',
        email: 'acarrascoarquitecto@gmail.com',
        dateBirthday: new Date(1980, 2 - 1, 23),
        address: 'Ramon Olivares 1176',
        city: 'Castro',
        phone: '985054393',
        gradoId: 1,
        categoryId: 3,
    },
    {
        username: '8679273-7',
        name: 'Pedro Gerardo',
        lastName: 'Andrade Oyarzun',
        email: 'pandradeo@gmail.com',
        dateBirthday: new Date(1962, 5 - 1, 18),
        address: 'Vilupulli Rural',
        city: 'Chonchi',
        phone: '998889819',
        gradoId: 1,
        categoryId: 3,
    },
];

async function main() {
    console.log('Iniciando seed de usuarios insinuados...');
    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    for (const u of usuarios) {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ username: u.username }, { email: u.email }] },
        });

        if (existing) {
            console.log(`⚠  Ya existe: ${u.name} ${u.lastName} (${u.username}) — omitido`);
            continue;
        }

        const slug = await generateUniqueSlug(u.name, u.lastName);

        await prisma.user.create({
            data: {
                username: u.username,
                name: u.name,
                lastName: u.lastName,
                email: u.email,
                password: hashed,
                slug,
                dateBirthday: u.dateBirthday,
                address: u.address,
                city: u.city,
                phone: u.phone,
                gradoId: u.gradoId,
                categoryId: u.categoryId,
                active: true,
            },
        });

        console.log(`✓ Creado: ${u.name} ${u.lastName} (${u.username})`);
    }

    console.log('Seed completado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
