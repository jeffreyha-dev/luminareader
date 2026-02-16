'use client';

import React from 'react';
import { X, Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useReaderStore } from '@/stores/readerStore';
import { db } from '@/lib/storage/db';
import { cn } from '@/lib/utils/cn';

export default function BookmarksPanel() {
    const {
        activePanel,
        setActivePanel,
        currentBook,
        bookmarks,
        setBookmarks,
        navigateTo
    } = useReaderStore();

    if (activePanel !== 'bookmarks') return null;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await db.annotations.delete(id);
        setBookmarks(bookmarks.filter(b => b.id !== id));
    };

    const handleNavigate = (bookmark: any) => {
        navigateTo(bookmark.position || bookmark.page);
        setActivePanel(null);
    };

    const sortedBookmarks = [...bookmarks]
        .filter(b => b.type === 'bookmark')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="fixed inset-y-0 right-0 w-80 glass border-l border-[var(--border)] z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Bookmark size={20} /> Bookmarks
                </h2>
                <button
                    onClick={() => setActivePanel(null)}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {sortedBookmarks.length > 0 ? (
                    sortedBookmarks.map((bookmark) => (
                        <div
                            key={bookmark.id}
                            onClick={() => handleNavigate(bookmark)}
                            className="group p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                                    {currentBook?.format === 'epub' ? 'Location' : 'Page'} {bookmark.page}
                                </span>
                                <button
                                    onClick={(e) => handleDelete(bookmark.id, e)}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-[var(--text-secondary)]"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p className="text-sm text-[var(--text-primary)] font-medium line-clamp-2 mb-1">
                                {bookmark.content}
                            </p>
                            <p className="text-[10px] text-[var(--text-secondary)]">
                                {new Date(bookmark.createdAt).toLocaleDateString()} at {new Date(bookmark.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>

                            {/* Highlight bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] opacity-50" />
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                        <Bookmark size={48} className="text-[var(--border)]" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[var(--text-primary)]">No bookmarks yet</p>
                            <p className="text-xs text-[var(--text-secondary)] px-8">
                                Click the bookmark icon in the toolbar to save your current page.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]/50">
                <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    Quick Navigation
                </p>
            </div>
        </div>
    );
}
