'use client';

import React from 'react';
import { X, Highlighter, MessageSquare, Trash2, Calendar } from 'lucide-react';
import { useReaderStore } from '@/stores/readerStore';
import { db } from '@/lib/storage/db';
import { cn } from '@/lib/utils/cn';

export default function AnnotationsPanel() {
    const {
        activePanel,
        setActivePanel,
        currentBook,
        bookmarks,
        setBookmarks,
        navigateTo
    } = useReaderStore();

    if (activePanel !== 'annotations') return null;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await db.annotations.delete(id);
        setBookmarks(bookmarks.filter(b => b.id !== id));
    };

    const handleNavigate = (annotation: any) => {
        navigateTo(annotation.position || annotation.page);
        setActivePanel(null);
    };

    const annotations = [...bookmarks]
        .filter(b => b.type === 'highlight' || b.type === 'note')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="fixed inset-y-0 right-0 w-80 glass border-l border-[var(--border)] z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Highlighter size={20} /> Annotations
                </h2>
                <button
                    onClick={() => setActivePanel(null)}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {annotations.length > 0 ? (
                    annotations.map((ann) => (
                        <div
                            key={ann.id}
                            onClick={() => handleNavigate(ann)}
                            className="group p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    {ann.type === 'highlight' ? <Highlighter size={10} /> : <MessageSquare size={10} />}
                                    {currentBook?.format === 'epub' ? 'Location' : 'Page'} {ann.page}
                                </span>
                                <button
                                    onClick={(e) => handleDelete(ann.id, e)}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-[var(--text-secondary)]"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div
                                className="text-sm text-[var(--text-primary)] font-medium mb-3 italic border-l-2 pl-3"
                                style={{ borderColor: ann.color }}
                            >
                                "{ann.content}"
                            </div>

                            {ann.note && (
                                <p className="text-xs text-[var(--text-secondary)] bg-white/5 p-2 rounded-lg mb-2">
                                    {ann.note}
                                </p>
                            )}

                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                                <Calendar size={10} />
                                {new Date(ann.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                        <Highlighter size={48} className="text-[var(--border)]" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[var(--text-primary)]">No highlights yet</p>
                            <p className="text-xs text-[var(--text-secondary)] px-8">
                                Select text in the reader to create highlights or add notes.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]/50">
                <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    {annotations.length} items recorded
                </p>
            </div>
        </div>
    );
}
