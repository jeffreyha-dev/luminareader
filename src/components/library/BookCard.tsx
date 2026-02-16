'use client';

import React, { useEffect, useState } from 'react';
import { BookRecord } from '@/lib/storage/db';
import { cn } from '@/lib/utils/cn';
import { Play, MoreVertical, Settings } from 'lucide-react';
import Link from 'next/link';
import BookOptionsModal from './BookOptionsModal';

interface BookCardProps {
    book: BookRecord;
    viewMode: 'grid' | 'list';
}

export default function BookCard({ book, viewMode }: BookCardProps) {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (book.coverBlob) {
            const url = URL.createObjectURL(book.coverBlob);
            setCoverUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [book.coverBlob]);

    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-elevated)] transition-all group">
                <div className="relative w-12 h-16 flex-shrink-0 bg-[var(--bg-surface)] rounded-md overflow-hidden border border-[var(--border)]">
                    {coverUrl ? (
                        <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-[10px] text-center p-1">
                            No Cover
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate text-[var(--text-primary)]">{book.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{book.author}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-32 hidden md:block">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-[var(--text-muted)]">{Math.round(book.progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                                style={{ width: `${book.progress}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href={`/reader/${book.id}`}
                        className="p-2 rounded-full bg-[var(--accent)] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Play size={14} fill="currentColor" />
                    </Link>
                    <button
                        onClick={() => setShowOptions(true)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>
                {showOptions && <BookOptionsModal book={book} onClose={() => setShowOptions(false)} />}
            </div>
        );
    }

    return (
        <div className="group flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:border-[var(--accent)]/50">
                {coverUrl ? (
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-[var(--text-muted)] font-bold text-lg mb-1 opacity-20 uppercase tracking-tighter leading-none">
                            {book.format}
                        </div>
                        <div className="text-[var(--text-muted)] text-[11px] font-medium px-4">
                            {book.title}
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col gap-2 scale-90 group-hover:scale-100 transition-all">
                        <Link
                            href={`/reader/${book.id}`}
                            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-xl transition-all"
                        >
                            <Play size={16} fill="currentColor" />
                            Read Now
                        </Link>
                        <button
                            onClick={() => setShowOptions(true)}
                            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-medium text-xs backdrop-blur-md transition-all"
                        >
                            <Settings size={14} />
                            Options
                        </button>
                    </div>
                </div>

                {/* Progress bar at bottom of cover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                        className="h-full bg-[var(--accent)] transition-all duration-700"
                        style={{ width: `${book.progress}%` }}
                    />
                </div>
            </div>

            <div className="px-1 relative">
                <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors pr-6">
                    {book.title}
                </h3>
                <button
                    onClick={() => setShowOptions(true)}
                    className="absolute right-0 top-0 p-1 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--text-primary)] transition-all"
                >
                    <MoreVertical size={14} />
                </button>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                    {book.author}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {book.format}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                        {Math.round(book.progress)}% read
                    </span>
                </div>
            </div>
            {showOptions && <BookOptionsModal book={book} onClose={() => setShowOptions(false)} />}
        </div>
    );
}
