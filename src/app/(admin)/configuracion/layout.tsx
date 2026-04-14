import { redirect } from 'next/navigation';

import { auth } from '@/shared/lib/auth';

export default async function ConfiguracionLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.ReactElement> {
    const session = await auth();
    if (!session || session.user.categoryId !== 1) redirect('/dashboard');
    return <>{children}</>;
}
