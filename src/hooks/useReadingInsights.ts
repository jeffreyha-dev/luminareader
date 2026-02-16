'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/storage/db';

export interface ReadingDayStat {
    date: string;
    durationMinutes: number;
    pages: number;
}

export interface ReadingInsights {
    totalTimeMinutes: number;
    totalPages: number;
    streakDays: number;
    inProgressBooks: number;
    todayMinutes: number;
    todayPages: number;
    days: ReadingDayStat[];
}

function toLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const EMPTY_INSIGHTS: ReadingInsights = {
    totalTimeMinutes: 0,
    totalPages: 0,
    streakDays: 0,
    inProgressBooks: 0,
    todayMinutes: 0,
    todayPages: 0,
    days: [],
};

export function useReadingInsights(): ReadingInsights {
    const data = useLiveQuery(async () => {
        const [sessions, books] = await Promise.all([
            db.reading_sessions.toArray(),
            db.books.toArray(),
        ]);
        return { sessions, books };
    }, []);

    return useMemo(() => {
        if (!data) return EMPTY_INSIGHTS;

        const { sessions, books } = data;
        const totalSeconds = sessions.reduce((acc, session) => acc + session.duration, 0);
        const totalPages = sessions.reduce((acc, session) => acc + session.pagesRead, 0);
        const inProgressBooks = books.filter((book) => book.progress > 0 && book.progress < 100).length;

        const now = new Date();
        const todayKey = toLocalDateKey(now);

        const sessionsByDay = new Map<string, { seconds: number; pages: number }>();
        for (const session of sessions) {
            const key = toLocalDateKey(new Date(session.startTime));
            const current = sessionsByDay.get(key) ?? { seconds: 0, pages: 0 };
            current.seconds += session.duration;
            current.pages += session.pagesRead;
            sessionsByDay.set(key, current);
        }

        const last7Days: ReadingDayStat[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = toLocalDateKey(date);
            const day = sessionsByDay.get(dateKey) ?? { seconds: 0, pages: 0 };
            last7Days.push({
                date: dateKey,
                durationMinutes: Math.round(day.seconds / 60),
                pages: day.pages,
            });
        }

        let streakDays = 0;
        const streakCursor = new Date(now);
        while (sessionsByDay.has(toLocalDateKey(streakCursor))) {
            streakDays += 1;
            streakCursor.setDate(streakCursor.getDate() - 1);
        }

        const today = sessionsByDay.get(todayKey) ?? { seconds: 0, pages: 0 };

        return {
            totalTimeMinutes: Math.round(totalSeconds / 60),
            totalPages,
            streakDays,
            inProgressBooks,
            todayMinutes: Math.round(today.seconds / 60),
            todayPages: today.pages,
            days: last7Days,
        };
    }, [data]);
}

