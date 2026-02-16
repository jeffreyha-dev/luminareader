'use client';

import React, { useEffect, use } from 'react';
import { db } from '@/lib/storage/db';
import { useReaderStore } from '@/stores/readerStore';
import ReaderToolbar from '@/components/reader/ReaderToolbar';
import SettingsPanel from '@/components/reader/SettingsPanel';
import NavigationPanel from '@/components/reader/NavigationPanel';
import SearchPanel from '@/components/reader/SearchPanel';
import BookmarksPanel from '@/components/reader/BookmarksPanel';
import AnnotationsPanel from '@/components/reader/AnnotationsPanel';
import { Loader2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useReadingSession } from '@/hooks/useReadingSession';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import ShortcutHelpOverlay from '@/components/reader/ShortcutHelpOverlay';

const EPUBViewer = dynamic(() => import('@/components/reader/engines/EPUBViewer'), { ssr: false });
const PDFViewer = dynamic(() => import('@/components/reader/engines/PDFViewer'), { ssr: false });
const ComicViewer = dynamic(() => import('@/components/reader/engines/ComicViewer'), { ssr: false });

export default function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    const {
        currentBook,
        setCurrentBook,
        isLoading,
        setLoading,
        error,
        setError,
        setToolbarVisible,
        activePanel,
        setActivePanel,
        prevPage,
        nextPage,
        bookmarks,
        setBookmarks
    } = useReaderStore();

    // Track reading session
    useReadingSession(currentBook?.id, currentBook?.currentPage || 1);

    // Global Reader Shortcuts
    useKeyboardShortcuts({
        'h': () => window.location.href = '/',
        'H': () => window.location.href = '/',
        '?': () => setIsHelpOpen(prev => !prev),
        'Escape': () => {
            if (activePanel) setActivePanel(null);
            else if (isHelpOpen) setIsHelpOpen(false);
            else window.location.href = '/';
        },
        'f': () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        },
        'F': () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        },
        's': () => setActivePanel(activePanel === 'settings' ? null : 'settings'),
        'S': () => setActivePanel(activePanel === 'settings' ? null : 'settings'),
        't': () => setActivePanel(activePanel === 'navigation' ? null : 'navigation'),
        'T': () => setActivePanel(activePanel === 'navigation' ? null : 'navigation'),
        'b': () => setActivePanel(activePanel === 'bookmarks' ? null : 'bookmarks'),
        'B': () => setActivePanel(activePanel === 'bookmarks' ? null : 'bookmarks'),
        'ArrowLeft': () => prevPage(),
        'ArrowUp': () => prevPage(),
        'ArrowRight': () => nextPage(),
        'ArrowDown': () => nextPage(),
    });

    useEffect(() => {
        async function loadBook() {
            setLoading(true);
            try {
                const book = await db.books.get(id);
                if (book) {
                    setCurrentBook(book);
                    // Load bookmarks/annotations
                    const annotations = await db.annotations
                        .where('bookId')
                        .equals(id)
                        .toArray();
                    setBookmarks(annotations);
                } else {
                    setError('Book not found');
                }
            } catch (err) {
                console.error('Failed to load book:', err);
                setError('Failed to load book from storage');
            }
        }
        loadBook();
    }, [id, setCurrentBook, setLoading, setError, setBookmarks]);

    // Handle auto-hiding toolbar
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleMouseMove = () => {
            setToolbarVisible(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setToolbarVisible(false);
            }, 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, [setToolbarVisible]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-primary)] h-screen">
                <Loader2 size={48} className="text-[var(--accent)] animate-spin mb-4" />
                <p className="text-[var(--text-secondary)] font-medium animate-pulse">
                    Opening your book...
                </p>
            </div>
        );
    }

    if (error || !currentBook) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-primary)] h-screen p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {error || 'An unexpected error occurred'}
                </h2>
                <p className="text-[var(--text-secondary)] max-w-xs mb-6">
                    There was a problem opening this book. It might be corrupted or missing from the library.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-semibold"
                >
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] relative select-none">
            <ReaderToolbar />

            <NavigationPanel />
            <SettingsPanel />
            <SearchPanel />
            <BookmarksPanel />
            <AnnotationsPanel />

            {/* Panel Backdrop */}
            {activePanel && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[55] animate-in fade-in duration-300"
                    onClick={() => setActivePanel(null)}
                />
            )}

            <div className="flex-1 relative">
                {currentBook.format === 'epub' && <EPUBViewer book={currentBook} />}
                {currentBook.format === 'pdf' && <PDFViewer book={currentBook} />}
                {(currentBook.format === 'cbz' || currentBook.format === 'cbr') && (
                    <ComicViewer book={currentBook} />
                )}
            </div>

            <ShortcutHelpOverlay
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
}
