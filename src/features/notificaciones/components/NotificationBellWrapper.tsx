// Server Component — hace el fetch en el servidor y pasa data al client bell
import { getNotifications, getUnreadCount } from '@/features/notificaciones/actions';

import { NotificationBell } from './NotificationBell';

export async function NotificationBellWrapper() {
    const [count, notifications] = await Promise.all([getUnreadCount(), getNotifications()]);

    return <NotificationBell initialCount={count} initialNotifications={notifications} />;
}
