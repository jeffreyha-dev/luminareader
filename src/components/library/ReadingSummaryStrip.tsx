'use client';

import React from 'react';
import { ArrowRight, BookOpen, Clock, Flame, Timer } from 'lucide-react';
import { useReadingInsights } from '@/hooks/useReadingInsights';

interface ReadingSummaryStripProps {
    onOpenInsights?: () => void;
}

export default function ReadingSummaryStrip({ onOpenInsights }: ReadingSummaryStripProps) {
    const stats = useReadingInsights();

    return (
        <div className="glass-card p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Reading Snapshot</h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                        Quick progress summary for today and overall momentum.
                    </p>
                </div>
                {onOpenInsights && (
                    <button
                        type="button"
                        onClick={onOpenInsights}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                        Full insights
                        <ArrowRight size={14} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-3">
                    <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                        <Timer size={12} />
                        Today
                    </div>
                    <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{stats.todayMinutes}m</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-3">
                    <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                        <Flame size={12} />
                        Streak
                    </div>
                    <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{stats.streakDays} days</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-3">
                    <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                        <BookOpen size={12} />
                        In Progress
                    </div>
                    <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{stats.inProgressBooks}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-3">
                    <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                        <Clock size={12} />
                        Total Pages
                    </div>
                    <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{stats.totalPages}</p>
                </div>
            </div>
        </div>
    );
}

