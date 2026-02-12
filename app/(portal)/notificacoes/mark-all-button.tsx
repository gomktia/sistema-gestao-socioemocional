'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCheck, Loader2 } from 'lucide-react';
import { markAllNotificationsAsRead } from '@/app/actions/notifications';
import { useRouter } from 'next/navigation';

export function NotificationMarkAllButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        setLoading(true);
        await markAllNotificationsAsRead();
        router.refresh();
        setLoading(false);
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            disabled={loading}
            className="text-xs font-bold"
        >
            {loading ? <Loader2 size={14} className="mr-2 animate-spin" /> : <CheckCheck size={14} className="mr-2" />}
            Marcar todas como lidas
        </Button>
    );
}
