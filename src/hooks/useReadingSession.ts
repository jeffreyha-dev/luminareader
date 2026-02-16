'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/storage/db';

/**
 * Hook to track reading sessions for a book.
 * Automatically starts a session on mount and ends it on unmount or visibility change.
 */
export function useReadingSession(bookId: string | undefined, currentPage: number) {
    const sessionId = useRef<string>(crypto.randomUUID());
    const startTime = useRef<Date>(new Date());
    const startPage = useRef<number>(currentPage);
    const latestPage = useRef<number>(currentPage);
    const hasSaved = useRef<boolean>(false);

    useEffect(() => {
        latestPage.current = currentPage;
    }, [currentPage]);

    useEffect(() => {
        if (!bookId) return;

        const resetSession = () => {
            sessionId.current = crypto.randomUUID();
            startTime.current = new Date();
            startPage.current = latestPage.current;
            hasSaved.current = false;
        };

        resetSession();

        const saveSession = async () => {
            if (hasSaved.current) return;

            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - startTime.current.getTime()) / 1000);

            // Only save sessions longer than 5 seconds to avoid noise
            if (duration < 5) return;

            hasSaved.current = true;

            try {
                await db.reading_sessions.add({
                    id: sessionId.current,
                    bookId,
                    startTime: startTime.current,
                    endTime,
                    duration,
                    pagesRead: Math.max(0, latestPage.current - startPage.current)
                });
            } catch (err) {
                console.error('Failed to save reading session:', err);
                hasSaved.current = false;
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                void saveSession();
            } else if (document.visibilityState === 'visible') {
                resetSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', saveSession);

        return () => {
            void saveSession();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', saveSession);
        };
    }, [bookId]);
}
