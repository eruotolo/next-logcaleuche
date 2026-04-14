import { cn } from '@/shared/lib/utils';

interface ActivityLogBadgeProps {
    value: string;
    type: 'action' | 'status';
}

function getActionColor(action: string): string {
    if (action.includes('.delete') || action.includes('.failed')) {
        return 'bg-red-500/15 text-red-400 border-red-500/20';
    }
    if (action.includes('.create') || action === 'auth.login') {
        return 'bg-green-500/15 text-green-400 border-green-500/20';
    }
    if (action.includes('.update') || action.includes('.import') || action.includes('.bulk')) {
        return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
    }
    if (action.includes('password') || action.includes('recovery')) {
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20';
    }
    return 'bg-white/5 text-[#aaa9be] border-white/10';
}

function getStatusColor(status: string): string {
    if (status === 'success') return 'bg-green-500/15 text-green-400 border-green-500/20';
    if (status === 'failure') return 'bg-red-500/15 text-red-400 border-red-500/20';
    if (status === 'warning') return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20';
    return 'bg-white/5 text-[#aaa9be] border-white/10';
}

export function ActivityLogBadge({ value, type }: ActivityLogBadgeProps): React.ReactElement {
    const colorClass =
        type === 'action' ? getActionColor(value) : getStatusColor(value);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium',
                colorClass,
            )}
        >
            {value}
        </span>
    );
}
