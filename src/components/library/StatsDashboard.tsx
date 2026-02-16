'use client';

import React from 'react';
import { Clock, BookOpen, Flame, Calendar } from 'lucide-react';
import { useReadingInsights } from '@/hooks/useReadingInsights';

export default function StatsDashboard() {
    const stats = useReadingInsights();
    const maxDuration = Math.max(...stats.days.map((d) => d.durationMinutes), 1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Reading Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stats Cards */}
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-[var(--text-secondary)]">Total Reading Time</div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{stats.totalTimeMinutes}m</div>
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
                        <div className="text-xl font-bold text-[var(--text-primary)]">{stats.streakDays} Days</div>
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
                                style={{ height: `${(day.durationMinutes / maxDuration) * 100}%`, minHeight: '4px' }}
                            />
                            {/* Bar Overlay */}
                            <div
                                className="absolute bottom-6 w-full bg-[var(--accent)] rounded-t-sm transition-all duration-500"
                                style={{ height: `${(day.durationMinutes / maxDuration) * 100}%`, minHeight: '4px' }}
                            />

                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-[10px] px-2 py-1 rounded border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none">
                                {day.durationMinutes} mins • {day.pages} pages
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
