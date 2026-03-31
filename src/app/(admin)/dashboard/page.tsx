import type { Metadata } from 'next';

import { getDashboardData } from '@/features/dashboard/actions';
import { DashboardContent } from '@/features/dashboard/components/DashboardContent';

import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Dashboard — Logia Caleuche 250',
};

export default async function DashboardPage() {
    const [session, data] = await Promise.all([auth(), getDashboardData()]);
    const categoryId = session?.user?.categoryId ?? 3;

    return <DashboardContent data={data} categoryId={categoryId} />;
}
