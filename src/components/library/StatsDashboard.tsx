'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/storage/db';
import { Clock, BookOpen, Flame, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DayStat {
    date: string;
    duration: number; // minutes
    pages: number;
}

export default function StatsDashboard() {
    const [stats, setStats] = useState<{
        totalTime: number; // minutes
        totalPages: number;
        streak: number;
        days: DayStat[];
    }>({
        totalTime: 0,
        totalPages: 0,
        streak: 0,
        days: []
    });

    useEffect(() => {
        async function loadStats() {
            const sessions = await db.reading_sessions.toArray();

            // Calculate totals
            const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
            const totalPages = sessions.reduce((acc, s) => acc + s.pagesRead, 0);

            // Calculate last 7 days
            const last7Days: DayStat[] = [];
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const daySessions = sessions.filter(s =>
                    s.startTime.toISOString().split('T')[0] === dateStr
                );

                last7Days.push({
                    date: dateStr,
                    duration: Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60),
                    pages: daySessions.reduce((acc, s) => acc + s.pagesRead, 0)
                });
            }

            // Simple streak calculation (mock for now, or based on days with sessions)
            const sessionDates = new Set(sessions.map(s => s.startTime.toISOString().split('T')[0]));
            let streak = 0;
            let checkDate = new Date(now);
            while (sessionDates.has(checkDate.toISOString().split('T')[0])) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }

            setStats({
                totalTime: Math.round(totalSeconds / 60),
                totalPages,
                streak,
                days: last7Days
            });
        }
        loadStats();
    }, []);

    const maxDuration = Math.max(...stats.days.map(d => d.duration), 1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Reading Insights</h2>
                <button className="text-[var(--accent)] text-sm font-medium flex items-center gap-1 hover:underline">
                    View full report <ChevronRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stats Cards */}
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-[var(--text-secondary)]">Total Reading Time</div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{stats.totalTime}m</div>
                    </div>
                </div>

                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-[var(--text-secondary)]">Pages Completed</div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{stats.totalPages}</div>
                    </div>
                </div>

                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Flame size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-[var(--text-secondary)]">Daily Streak</div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{stats.streak} Days</div>
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart (Simple SVG/CSS) */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar size={18} className="text-[var(--text-secondary)]" />
                    <span className="font-medium text-[var(--text-primary)]">Weekly Activity</span>
                </div>

                <div className="h-32 flex items-end justify-between gap-2 px-2">
                    {stats.days.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                            <div
                                className="w-full bg-[var(--accent)] rounded-t-sm opacity-20 group-hover:opacity-40 transition-opacity"
                                style={{ height: `${(day.duration / maxDuration) * 100}%`, minHeight: '4px' }}
                            />
                            {/* Bar Overlay */}
                            <div
                                className="absolute bottom-6 w-full bg-[var(--accent)] rounded-t-sm transition-all duration-500"
                                style={{ height: `${(day.duration / maxDuration) * 100}%`, minHeight: '4px' }}
                            />

                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-[10px] px-2 py-1 rounded border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none">
                                {day.duration} mins • {day.pages} pages
                            </div>

                            <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
