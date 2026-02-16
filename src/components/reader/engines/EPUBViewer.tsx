'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BookRecord, db } from '@/lib/storage/db';
import { useReaderStore } from '@/stores/readerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface EPUBViewerProps {
    book: BookRecord;
}

export default function EPUBViewer({ book }: EPUBViewerProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const renditionRef = useRef<any>(null);
    const bookRef = useRef<any>(null);

    const [isInitializing, setIsInitializing] = useState(true);
    const [currentPage, setCurrentPage] = useState(book.currentPage || 1);
    const [totalPages, setTotalPages] = useState(book.totalPages || 0);
    const [hasError, setHasError] = useState(false);

    const {
        theme,
        customThemeBackground,
        customThemeText,
        fontSize,
        fontFamily,
        customFontFamily,
        lineHeight,
        readingDirection
    } = useSettingsStore();
    const { updateProgress, setToc, setSearchResults, setSearching } = useReaderStore();

    /** Apply CSS theme/typography to the epub.js rendition. */
    const applyStyles = useCallback((
        t: string,
        customBg: string,
        customText: string,
        s: number,
        f: string,
        customFont: string,
        lh: number
    ) => {
        if (!renditionRef.current) return;

        const colors: Record<string, { bg: string; text: string }> = {
            dark: { bg: '#0f0f1a', text: '#e8e8f0' },
            light: { bg: '#fafafa', text: '#1a1a2e' },
            sepia: { bg: '#f4ecd8', text: '#3d3126' },
            custom: { bg: customBg, text: customText },
        };

        const themeColors = colors[t] || colors.dark;
        const fontStacks: Record<string, string> = {
            serif: '"Literata", "Times New Roman", serif',
            'sans-serif': '"Inter", "Helvetica Neue", Arial, sans-serif',
            monospace: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
            dyslexic: '"OpenDyslexic", "Comic Sans MS", sans-serif',
            custom: customFont || '"Literata", "Times New Roman", serif',
        };
        const fontStack = fontStacks[f] || fontStacks.serif;

        renditionRef.current.themes.register('custom', {
            body: {
                background: `${themeColors.bg} !important`,
                color: `${themeColors.text} !important`,
                'font-family': `${fontStack} !important`,
                'font-size': `${s}px !important`,
                'line-height': `${lh} !important`,
                padding: '0 !important',
                margin: '0 !important',
            }
        });

        renditionRef.current.themes.select('custom');
    }, []);

    // Initialise epub.js on mount
    useEffect(() => {
        let isMounted = true;

        async function initEpub() {
            if (!viewerRef.current) return;

            try {
                const { default: ePub } = await import('epubjs');
                if (!isMounted) return;

                const arrayBuffer = await book.fileBlob.arrayBuffer();
                if (!isMounted) return;

                const epubBook = ePub(arrayBuffer);
                bookRef.current = epubBook;

                // Render into a container — epub.js requires pixel dimensions.
                // We read the measured size of the container div.
                const rect = viewerRef.current.getBoundingClientRect();
                const rendition = epubBook.renderTo(viewerRef.current, {
                    width: rect.width || '100%',
                    height: rect.height || '100%',
                    flow: 'paginated',
                    manager: 'default',
                    allowScriptedContent: true,
                });

                renditionRef.current = rendition;

                // Display saved position or start
                const savedLocation = book.metadata?.cfi || undefined;
                await rendition.display(savedLocation);
                if (!isMounted) return;

                // Apply theme styles
                applyStyles(theme, customThemeBackground, customThemeText, fontSize, fontFamily, customFontFamily, lineHeight);

                // Track location changes
                rendition.on('relocated', (location: any) => {
                    if (!isMounted) return;

                    const progress = location.start.percentage * 100;
                    const cfi = location.start.cfi;
                    const displayedPage = location.start.displayed?.page ?? currentPage;
                    const totalDisplayed = location.start.displayed?.total ?? totalPages;

                    setCurrentPage(displayedPage);
                    setTotalPages(totalDisplayed);

                    updateProgress(progress, displayedPage);
                    db.books.update(book.id, {
                        progress,
                        currentPage: displayedPage,
                        metadata: { ...book.metadata, cfi }
                    });
                });

                // Handle text selection → highlight
                rendition.on('selected', async (cfiRange: string, contents: any) => {
                    const text = contents.window.getSelection()?.toString();
                    if (!text) return;

                    const highlight = {
                        id: crypto.randomUUID(),
                        bookId: book.id,
                        type: 'highlight' as const,
                        page: 0,
                        position: cfiRange,
                        content: text,
                        color: 'rgba(255, 255, 0, 0.4)',
                        createdAt: new Date()
                    };

                    await db.annotations.add(highlight);
                    const current = useReaderStore.getState().bookmarks;
                    useReaderStore.getState().setBookmarks([...current, highlight]);
                    rendition.annotations.add('highlight', cfiRange, {}, () => { }, 'highlight-class');
                    contents.window.getSelection()?.removeAllRanges();
                });

                // Re-apply existing highlights
                const annotations = useReaderStore.getState().bookmarks;
                annotations
                    .filter((b: any) => b.type === 'highlight' && b.position)
                    .forEach((ann: any) => {
                        rendition.annotations.add('highlight', ann.position, {}, () => { }, 'highlight-class');
                    });

                // Extract TOC
                try {
                    const nav = await epubBook.loaded.navigation;
                    setToc(nav.toc || []);
                } catch { /* some books don't have navigation */ }

                setIsInitializing(false);
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to initialize EPUB:', err);
                    setHasError(true);
                    setIsInitializing(false);
                }
            }
        }

        initEpub();

        return () => {
            isMounted = false;
            if (renditionRef.current) {
                try { renditionRef.current.destroy(); } catch { }
            }
            if (bookRef.current) {
                try { bookRef.current.destroy(); } catch { }
            }
        };
    }, [book.id, applyStyles]);

    // Re-apply styles when settings change
    useEffect(() => {
        applyStyles(theme, customThemeBackground, customThemeText, fontSize, fontFamily, customFontFamily, lineHeight);
    }, [theme, customThemeBackground, customThemeText, fontSize, fontFamily, customFontFamily, lineHeight, applyStyles]);

    const goBack = useCallback(() => {
        if (readingDirection === 'rtl') {
            renditionRef.current?.next();
            return;
        }
        renditionRef.current?.prev();
    }, [readingDirection]);

    const goForward = useCallback(() => {
        if (readingDirection === 'rtl') {
            renditionRef.current?.prev();
            return;
        }
        renditionRef.current?.next();
    }, [readingDirection]);

    // Register navigation + search actions
    useEffect(() => {
        useReaderStore.setState({
            navigateTo: (loc) => {
                renditionRef.current?.display(loc);
            },
            prevPage: () => {
                goBack();
            },
            nextPage: () => {
                goForward();
            },
            search: async (query: string) => {
                if (!bookRef.current) return;
                setSearching(true);
                try {
                    const results = await bookRef.current.find(query);
                    setSearchResults(results.map((r: any) => ({
                        cfi: r.cfi,
                        excerpt: r.excerpt,
                        label: 'Result in section'
                    })));
                } catch (err) {
                    console.error('EPUB Search Error:', err);
                    setSearchResults([]);
                } finally {
                    setSearching(false);
                }
            }
        });

        return () => {
            useReaderStore.setState({
                navigateTo: () => { },
                prevPage: () => { },
                nextPage: () => { },
                search: async () => { }
            });
        };
    }, [goBack, goForward, setSearchResults, setSearching]);

    if (hasError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <p className="text-red-400 font-bold mb-2">Failed to load EPUB</p>
                <p className="text-sm text-[var(--text-secondary)]">
                    The file may be corrupted or in an unsupported format.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent relative">
            {isInitializing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]">
                    <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* Click zones for page turning */}
            <div className="absolute inset-0 flex z-[1] pointer-events-none">
                <div className="w-1/4 h-full cursor-w-resize pointer-events-auto" onClick={goBack} />
                <div className="w-1/2 h-full" />
                <div className="w-1/4 h-full cursor-e-resize pointer-events-auto" onClick={goForward} />
            </div>

            {/*
              epub.js container.
              CRITICAL: this div MUST have a concrete height. We use absolute positioning
              within the flex parent so the div fills its parent's measured size.
            */}
            <div
                ref={viewerRef}
                style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            />

            {/* Floating nav buttons */}
            <div className="fixed bottom-8 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
                <button
                    onClick={goBack}
                    className="p-3 glass border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] pointer-events-auto transition-all hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={goForward}
                    className="p-3 glass border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] pointer-events-auto transition-all hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
