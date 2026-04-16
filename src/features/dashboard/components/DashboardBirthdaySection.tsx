import { BirthdayCard } from '@/shared/components/BirthdayCard';
import { prisma } from '@/shared/lib/db';

interface BirthdayEntry {
    id: number;
    name: string | null;
    lastName: string | null;
    image: string | null;
    nextBirthday: Date;
    daysUntil: number;
}

function computeUpcomingBirthdays(
    users: { id: number; name: string | null; lastName: string | null; dateBirthday: Date | null; image: string | null }[],
    today: Date,
): BirthdayEntry[] {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return users
        .filter((u) => u.dateBirthday !== null)
        .map((u) => {
            const bday = u.dateBirthday as Date;
            const currentYear = today.getFullYear();
            let next = new Date(currentYear, bday.getUTCMonth(), bday.getUTCDate());
            if (next < startOfToday) {
                next = new Date(currentYear + 1, bday.getUTCMonth(), bday.getUTCDate());
            }
            const daysUntil = Math.round(
                (next.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
            );
            return { id: u.id, name: u.name, lastName: u.lastName, image: u.image, nextBirthday: next, daysUntil };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);
}

export async function DashboardBirthdaySection(): Promise<React.ReactNode> {
    const usersWithBirthday = await prisma.user.findMany({
        where: { active: true, dateBirthday: { not: null } },
        select: { id: true, name: true, lastName: true, dateBirthday: true, image: true },
    });

    const upcomingBirthdays = computeUpcomingBirthdays(usersWithBirthday, new Date());

    return (
        <BirthdayCard birthdays={upcomingBirthdays} maxItems={9} className="h-full" />
    );
}
