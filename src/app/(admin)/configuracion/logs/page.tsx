import { getActivityLogUsuarios, getActivityLogs } from '@/features/configuracion/actions';
import { ActivityLogsView } from '@/features/configuracion/components/ActivityLogsView';

interface LogsPageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function LogsPage({ searchParams }: LogsPageProps): Promise<React.ReactElement> {
    const sp = await searchParams;
    const [result, usuarios] = await Promise.all([
        getActivityLogs(sp),
        getActivityLogUsuarios(),
    ]);

    return (
        <ActivityLogsView
            items={result.items}
            total={result.total}
            page={result.page}
            pageSize={result.pageSize}
            totalPages={result.totalPages}
            usuarios={usuarios}
            currentFilters={sp}
        />
    );
}
