'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved';

export function useAutosave<T>(
    key: string,
    values: T,
    delay = 3000,
): { status: AutosaveStatus; restore: () => T | null; clear: () => void } {
    const [status, setStatus] = useState<AutosaveStatus>('idle');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Track if this is the initial render to avoid saving on mount
    const isMountedRef = useRef(false);

    useEffect(() => {
        // Skip the first render — we don't want to overwrite a draft on mount
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            return;
        }

        // Cancel any pending save before scheduling a new one
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }

        setStatus('saving');

        timerRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(values));
                setStatus('saved');
            } catch {
                // localStorage may be unavailable (private browsing quota exceeded, etc.)
                setStatus('idle');
            }
            timerRef.current = null;
        }, delay);

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, [key, values, delay]);

    const restore = useCallback((): T | null => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return null;
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }, [key]);

    const clear = useCallback((): void => {
        try {
            localStorage.removeItem(key);
        } catch {
            // Ignore — if localStorage is unavailable the draft simply doesn't exist
        }
        setStatus('idle');
    }, [key]);

    return { status, restore, clear };
}
