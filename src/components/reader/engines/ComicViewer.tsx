'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BlobReader, ZipReader, BlobWriter } from '@zip.js/zip.js';
import { BookRecord, db } from '@/lib/storage/db';
import { useReaderStore } from '@/stores/readerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    Square,
    Columns2,
    ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ComicViewerProps {
    book: BookRecord;
}

export default function ComicViewer({ book }: ComicViewerProps) {
    const [pages, setPages] = useState<string[]>([]);
    const [pageNum, setPageNum] = useState(book.currentPage || 1);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLandscape, setIsLandscape] = useState(false);

    // Use a ref to track blob URLs for cleanup so we never capture a stale closure
    const pagesRef = useRef<string[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const { updateProgress } = useReaderStore();
    const { readingDirection, comicMode, setComicMode } = useSettingsStore();
    const isDoubleSpread = comicMode === 'double' && isLandscape;
    const pageStep = isDoubleSpread ? 2 : 1;

    useEffect(() => {
        let isMounted = true;

        async function loadComic() {
            try {
                if (book.format === 'cbz') {
                    const blobReader = new BlobReader(book.fileBlob);
                    const zipReader = new ZipReader(blobReader);
                    const entries = await zipReader.getEntries();

                    const imageEntries = entries
                        .filter(e => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(e.filename))
                        .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));

                    if (!isMounted) {
                        await zipReader.close();
                        return;
                    }

                    const pageUrls: string[] = [];
                    for (const entry of imageEntries) {
                        if (!isMounted) break;
                        const blob = await (entry as any).getData(new BlobWriter());
                        pageUrls.push(URL.createObjectURL(blob));
                    }
                    await zipReader.close();

                    if (isMounted) {
                        pagesRef.current = pageUrls;
                        setPages(pageUrls);
                        setIsInitializing(false);
                    }
                    /*
                    } else if (book.format === 'cbr') {
                        const { createExtractorFromData } = await import('unrar-js');
                        const arrayBuffer = await book.fileBlob.arrayBuffer();
                        const extractor = await createExtractorFromData(arrayBuffer);
                        const list = extractor.getFileList();
    
                        const imageFiles = list.arcHeader.fileHeaders
                            .filter(h => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(h.name))
                            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    
                        if (!isMounted) return;
    
                        const pageUrls: string[] = [];
                        for (const fileHeader of imageFiles) {
                            if (!isMounted) break;
                            const extracted = extractor.extractFiles([fileHeader.name]);
                            const fileData = extracted.files[0];
                            if (fileData.extraction) {
                                const blob = new Blob([fileData.extraction]);
                                pageUrls.push(URL.createObjectURL(blob));
                            }
                        }
    
                        if (isMounted) {
                            pagesRef.current = pageUrls;
                            setPages(pageUrls);
                            setIsInitializing(false);
                        }
                    */
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error('Failed to load comic:', err);
                    setIsInitializing(false);
                }
            }
        }

        loadComic();

        return () => {
            isMounted = false;
            // Revoke from ref, not from state closure
            pagesRef.current.forEach(url => URL.revokeObjectURL(url));
            pagesRef.current = [];
        };
    }, [book.id]);

    // Persist progress
    useEffect(() => {
        if (pages.length > 0) {
            const progress = (pageNum / pages.length) * 100;
            updateProgress(progress, pageNum);
            db.books.update(book.id, {
                progress,
                currentPage: pageNum,
                totalPages: pages.length
            });
        }
    }, [pageNum, pages.length, book.id, updateProgress]);

    const changePage = useCallback((offset: number) => {
        setPageNum(prev => {
            const next = prev + offset;
            if (next >= 1 && next <= pagesRef.current.length) {
                if (containerRef.current) containerRef.current.scrollTop = 0;
                return next;
            }
            return prev;
        });
    }, []);
    const goBack = useCallback(() => {
        changePage(readingDirection === 'rtl' ? pageStep : -pageStep);
    }, [changePage, pageStep, readingDirection]);
    const goForward = useCallback(() => {
        changePage(readingDirection === 'rtl' ? -pageStep : pageStep);
    }, [changePage, pageStep, readingDirection]);

    useEffect(() => {
        const updateOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    // Clamp saved page to the archive bounds once we know total pages.
    useEffect(() => {
        if (pages.length === 0) return;
        setPageNum((prev) => Math.min(Math.max(prev, 1), pages.length));
    }, [pages.length]);

    useEffect(() => {
        if (!isDoubleSpread) return;
        setPageNum((prev) => (prev > 1 && prev % 2 === 0 ? prev - 1 : prev));
    }, [isDoubleSpread]);

    // Register navigation actions so global keyboard shortcuts work for comics.
    useEffect(() => {
        useReaderStore.setState({
            prevPage: goBack,
            nextPage: goForward,
        });

        return () => {
            useReaderStore.setState({
                prevPage: () => { },
                nextPage: () => { },
            });
        };
    }, [goBack, goForward]);

    // Local fallback for keyboard navigation inside comic reader.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                goBack();
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                goForward();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goBack, goForward]);

    if (isInitializing) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-primary)] h-screen">
                <Loader2 size={48} className="text-[var(--accent)] animate-spin mb-4" />
                <p className="text-[var(--text-secondary)] font-medium">Extracting panels...</p>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <p className="text-red-400 font-bold mb-2">No images found</p>
                <p className="text-sm text-[var(--text-secondary)]">
                    This archive doesn't appear to contain any supported image files.
                </p>
            </div>
        );
    }

    const canGoBack = readingDirection === 'rtl'
        ? pageNum + pageStep <= pages.length
        : pageNum - pageStep >= 1;
    const canGoForward = readingDirection === 'rtl'
        ? pageNum - pageStep >= 1
        : pageNum + pageStep <= pages.length;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] overflow-hidden relative">
            {/* Mode Toggle */}
            <div className="fixed bottom-24 right-8 flex flex-col gap-2 z-20">
                <button
                    onClick={() => setComicMode('single')}
                    className={cn(
                        "p-3 glass border border-[var(--border)] rounded-full transition-all shadow-lg",
                        comicMode === 'single' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                    )}
                >
                    <Square size={20} />
                </button>
                <button
                    onClick={() => setComicMode('double')}
                    className={cn(
                        "p-3 glass border border-[var(--border)] rounded-full transition-all shadow-lg",
                        comicMode === 'double' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                    )}
                    title="Double-page (landscape only)"
                >
                    <Columns2 size={20} />
                </button>
                <button
                    onClick={() => setComicMode('continuous')}
                    className={cn(
                        "p-3 glass border border-[var(--border)] rounded-full transition-all shadow-lg",
                        comicMode === 'continuous' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                    )}
                >
                    <ArrowDown size={20} />
                </button>
            </div>

            <div
                ref={containerRef}
                className={cn(
                    "flex-1 overflow-auto no-scrollbar",
                    comicMode !== 'continuous' ? "flex items-center justify-center" : "flex flex-col items-center"
                )}
            >
                {comicMode !== 'continuous' ? (
                    <div className="relative h-full w-full flex items-center justify-center p-4">
                        {/* Touch Zones */}
                    <div className="absolute inset-0 flex z-10">
                            <div className="w-1/2 h-full cursor-pointer" onClick={goBack} />
                            <div className="w-1/2 h-full cursor-pointer" onClick={goForward} />
                        </div>

                        {isDoubleSpread ? (
                            <div className="flex items-center justify-center gap-3 h-[calc(100vh-8rem)] max-w-full">
                                <img
                                    src={pages[pageNum - 1]}
                                    alt={`Page ${pageNum}`}
                                    className="h-full w-auto max-w-[48vw] object-contain shadow-2xl select-none"
                                    draggable={false}
                                />
                                {pages[pageNum] && (
                                    <img
                                        src={pages[pageNum]}
                                        alt={`Page ${pageNum + 1}`}
                                        className="h-full w-auto max-w-[48vw] object-contain shadow-2xl select-none"
                                        draggable={false}
                                    />
                                )}
                            </div>
                        ) : (
                            <img
                                src={pages[pageNum - 1]}
                                alt={`Page ${pageNum}`}
                                className="h-[calc(100vh-8rem)] w-auto max-w-full object-contain shadow-2xl select-none"
                                draggable={false}
                            />
                        )}

                        {/* Explicit nav buttons for discoverable page turning */}
                        <button
                            onClick={goBack}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={goForward}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                            aria-label="Next page"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 p-4 max-w-4xl w-full">
                        {pages.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Page ${i + 1}`}
                                className="w-full h-auto shadow-xl select-none"
                                draggable={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {comicMode !== 'continuous' && (
                <div className="h-16 flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-secondary)] px-8 z-20">
                    <button
                        onClick={goBack}
                        disabled={!canGoBack}
                        className="p-2 disabled:opacity-30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="text-sm font-medium text-[var(--text-secondary)]">
                        {isDoubleSpread ? (
                            <>Panels <span className="text-[var(--text-primary)]">{pageNum}-{Math.min(pageNum + 1, pages.length)}</span> of {pages.length}</>
                        ) : (
                            <>Panel <span className="text-[var(--text-primary)]">{pageNum}</span> of {pages.length}</>
                        )}
                    </div>

                    <button
                        onClick={goForward}
                        disabled={!canGoForward}
                        className="p-2 disabled:opacity-30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}
