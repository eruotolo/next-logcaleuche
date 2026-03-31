'use client';

import { useCallback, useState } from 'react';

export function useModal<T = undefined>() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<T | undefined>(undefined);

    const open = useCallback((itemData?: T) => {
        setData(itemData);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setData(undefined);
    }, []);

    return { isOpen, data, open, close } as const;
}
