'use client';

import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Settings,
    Bookmark,
    Menu,
    Maximize2,
    Minimize2,
    Highlighter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/readerStore';
import { db } from '@/lib/storage/db';
import { cn } from '@/lib/utils/cn';
import { Search } from 'lucide-react';

export default function ReaderToolbar() {
    const router = useRouter();
    const {
        currentBook,
        isToolbarVisible,
        activePanel,
        setActivePanel,
        bookmarks,
        setBookmarks
    } = useReaderStore();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const isBookmarked = currentBook && bookmarks.some(b =>
        b.type === 'bookmark' &&
        (currentBook.format === 'epub'
            ? b.position === currentBook.metadata?.cfi
            : b.page === currentBook.currentPage)
    );

    const toggleBookmark = async () => {
        if (!currentBook) return;

        const position = currentBook.format === 'epub' ? currentBook.metadata?.cfi : currentBook.currentPage.toString();
        const existing = bookmarks.find(b =>
            b.type === 'bookmark' &&
            (currentBook.format === 'epub'
                ? b.position === position
                : b.page === currentBook.currentPage)
        );

        if (existing) {
            await db.annotations.delete(existing.id);
            setBookmarks(bookmarks.filter(b => b.id !== existing.id));
        } else {
            const newBookmark = {
                id: crypto.randomUUID(),
                bookId: currentBook.id,
                type: 'bookmark' as const,
                page: currentBook.currentPage,
                position: position || '',
                content: `Bookmark at ${currentBook.format === 'epub' ? 'location' : 'page'} ${currentBook.currentPage}`,
                color: 'var(--accent)',
                createdAt: new Date()
            };
            await db.annotations.add(newBookmark);
            setBookmarks([...bookmarks, newBookmark]);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 h-16 glass border-b border-[var(--border)] z-50 flex items-center justify-between px-4 transition-transform duration-300 ease-in-out",
                isToolbarVisible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/')}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1 max-w-[200px] sm:max-w-md">
                        {currentBook?.title || 'Loading...'}
                    </h1>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {currentBook?.author || 'Unknown Author'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setActivePanel(activePanel === 'search' ? null : 'search')}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        activePanel === 'search'
                            ? "bg-[var(--accent)] text-white"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    <Search size={20} />
                </button>
                <button
                    onClick={toggleBookmark}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        isBookmarked
                            ? "bg-[var(--accent)] text-white"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={() => setActivePanel(activePanel === 'annotations' ? null : 'annotations')}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        activePanel === 'annotations'
                            ? "bg-[var(--accent)] text-white"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    <Highlighter size={20} />
                </button>
                <button
                    onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        activePanel === 'settings'
                            ? "bg-[var(--accent)] text-white"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    <Settings size={20} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                    onClick={() => setActivePanel(activePanel === 'navigation' ? null : 'navigation')}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        activePanel === 'navigation'
                            ? "bg-[var(--accent)] text-white"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    <Menu size={20} />
                </button>
            </div>
        </div>
    );
}
