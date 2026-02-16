'use client';

import React from 'react';
import { X, List, Bookmark, ChevronRight } from 'lucide-react';
import { useReaderStore } from '@/stores/readerStore';
import { cn } from '@/lib/utils/cn';

interface TOCItemProps {
    item: any;
    onNavigate: (href: string) => void;
    depth?: number;
}

function TOCItem({ item, onNavigate, depth = 0 }: TOCItemProps) {
    return (
        <div className="flex flex-col">
            <button
                onClick={() => onNavigate(item.href)}
                className={cn(
                    "text-left py-2 px-3 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-sm text-[var(--text-primary)] group flex items-center gap-2",
                    depth > 0 && "ml-4 border-l border-[var(--border)] pl-4"
                )}
            >
                <span className="truncate flex-1 group-hover:text-[var(--accent)] transition-colors">
                    {item.label}
                </span>
                {item.subitems && item.subitems.length > 0 && <ChevronRight size={14} className="text-[var(--text-secondary)]" />}
            </button>
            {item.subitems && item.subitems.length > 0 && (
                <div className="flex flex-col">
                    {item.subitems.map((sub: any, i: number) => (
                        <TOCItem key={i} item={sub} onNavigate={onNavigate} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function NavigationPanel() {
    const { activePanel, setActivePanel, toc, navigateTo } = useReaderStore();

    if (activePanel !== 'navigation') return null;

    const handleNavigate = (href: string) => {
        navigateTo(href);
        setActivePanel(null); // Close panel on navigation
    };

    return (
        <div className="fixed inset-y-0 left-0 w-80 glass border-r border-[var(--border)] z-[60] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <List size={20} /> Navigation
                </h2>
                <button
                    onClick={() => setActivePanel(null)}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] px-2">Table of Contents</h3>
                    <div className="space-y-1">
                        {toc && toc.length > 0 ? (
                            toc.map((item, i) => (
                                <TOCItem key={i} item={item} onNavigate={handleNavigate} />
                            ))
                        ) : (
                            <p className="px-4 py-3 text-sm text-[var(--text-secondary)] italic bg-[var(--bg-elevated)]/50 rounded-lg border border-dashed border-[var(--border)]">
                                No contents available.
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] px-2">Stored Bookmarks</h3>
                    <div className="space-y-1">
                        <p className="px-4 py-3 text-sm text-[var(--text-secondary)] italic">
                            No bookmarks yet.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]/50">
                <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    Swipe to turn pages
                </p>
            </div>
        </div>
    );
}
