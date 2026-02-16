'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BookRecord, db } from '@/lib/storage/db';
import { useReaderStore } from '@/stores/readerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface PDFViewerProps {
    book: BookRecord;
}

export default function PDFViewer({ book }: PDFViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pdfRef = useRef<any>(null);
    const pdfjsRef = useRef<any>(null);
    const renderTaskRef = useRef<any>(null);

    const [pageNum, setPageNum] = useState(book.currentPage || 1);
    const [numPages, setNumPages] = useState(book.totalPages || 0);
    const [scale, setScale] = useState(1.5);
    const [isRendering, setIsRendering] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLandscape, setIsLandscape] = useState(false);

    const { updateProgress, setToc, setSearchResults, setSearching, bookmarks, setBookmarks } = useReaderStore();
    const { comicMode } = useSettingsStore();
    const isDoubleSpread = comicMode === 'double' && isLandscape;

    const isRenderingRef = useRef(false);
    const getSpreadStartPage = useCallback((page: number, spread: boolean) => {
        if (!spread || page <= 1) return page;
        return page % 2 === 0 ? page - 1 : page;
    }, []);

    const getFitScaleForPage = useCallback((page: any) => {
        if (!containerRef.current) return 1.5;

        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = Math.max(1, containerRef.current.clientWidth - 64);
        const containerHeight = Math.max(1, containerRef.current.clientHeight - 64);

        const widthScale = containerWidth / baseViewport.width;
        const heightScale = containerHeight / baseViewport.height;
        const fitScale = Math.min(widthScale, heightScale);

        return Math.min(Math.max(fitScale, 0.5), 4);
    }, []);

    const renderPage = useCallback(async (n: number, s: number, spread: boolean) => {
        if (!pdfRef.current || !canvasRef.current || !pdfjsRef.current) return;

        // Prevent concurrent renders on the same canvas
        if (isRenderingRef.current) {
            // Cancel the active render first, then wait a tick
            if (renderTaskRef.current) {
                try { renderTaskRef.current.cancel(); } catch { }
            }
            return;
        }

        isRenderingRef.current = true;
        setIsRendering(true);

        try {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;

            const leftPage = await pdfRef.current.getPage(n);
            const leftViewport = leftPage.getViewport({ scale: s });

            if (spread) {
                const rightPageNum = n + 1;
                const rightPage = rightPageNum <= pdfRef.current.numPages
                    ? await pdfRef.current.getPage(rightPageNum)
                    : null;
                const rightViewport = rightPage ? rightPage.getViewport({ scale: s }) : null;
                const gap = rightViewport ? 20 : 0;

                canvas.height = Math.max(leftViewport.height, rightViewport?.height || 0);
                canvas.width = leftViewport.width + (rightViewport?.width || 0) + gap;

                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);

                const leftRenderTask = leftPage.render({
                    canvasContext: context,
                    viewport: leftViewport,
                });
                renderTaskRef.current = leftRenderTask;
                await leftRenderTask.promise;

                if (rightPage && rightViewport) {
                    const rightRenderTask = rightPage.render({
                        canvasContext: context,
                        viewport: rightViewport,
                        transform: [1, 0, 0, 1, leftViewport.width + gap, 0],
                    });
                    renderTaskRef.current = rightRenderTask;
                    await rightRenderTask.promise;
                }
            } else {
                canvas.height = leftViewport.height;
                canvas.width = leftViewport.width;

                const renderTask = leftPage.render({
                    canvasContext: context,
                    viewport: leftViewport,
                });
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            }

            // Update store and DB
            const total = pdfRef.current?.numPages || 1;
            const visiblePage = spread ? Math.min(n + 1, total) : n;
            const progress = (visiblePage / total) * 100;
            updateProgress(progress, n);
            db.books.update(book.id, { progress, currentPage: n });
        } catch (err: any) {
            if (err?.name !== 'RenderingCancelledException') {
                console.error('PDF Render Error:', err);
            }
        } finally {
            isRenderingRef.current = false;
            setIsRendering(false);
        }
    }, [book.id, updateProgress]);

    useEffect(() => {
        const updateOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function initPdf() {
            try {
                const pdfjsModule = await import('pdfjs-dist');
                const pdfjs = (pdfjsModule as any).default || pdfjsModule;

                if (!isMounted) return;

                pdfjsRef.current = pdfjs;

                // Serve worker from /public — copied from node_modules/pdfjs-dist/build/
                if (pdfjs.GlobalWorkerOptions) {
                    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
                }

                const arrayBuffer = await book.fileBlob.arrayBuffer();
                if (!isMounted) return;

                const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                if (!isMounted) {
                    pdf.destroy();
                    return;
                }

                pdfRef.current = pdf;
                setNumPages(pdf.numPages);

                // Extract TOC
                try {
                    const outline = await pdf.getOutline();
                    if (outline && isMounted) {
                        const resolveOutline = async (items: any[]): Promise<any[]> => {
                            return Promise.all(items.map(async (item) => {
                                let pg = null;
                                try {
                                    if (typeof item.dest === 'string') {
                                        const dest = await pdf.getDestination(item.dest);
                                        if (dest) pg = (await pdf.getPageIndex(dest[0])) + 1;
                                    } else if (Array.isArray(item.dest)) {
                                        pg = (await pdf.getPageIndex(item.dest[0])) + 1;
                                    }
                                } catch { }
                                return {
                                    label: item.title,
                                    href: pg,
                                    subitems: item.items ? await resolveOutline(item.items) : []
                                };
                            }));
                        };
                        const resolved = await resolveOutline(outline);
                        if (isMounted) setToc(resolved);
                    }
                } catch { }

                setIsInitializing(false);
                // Render initial page at fit-to-container scale.
                const initialPage = getSpreadStartPage(book.currentPage || 1, isDoubleSpread);
                const page = await pdf.getPage(initialPage);
                const fitScale = getFitScaleForPage(page);
                setPageNum(initialPage);
                setScale(fitScale);
                renderPage(initialPage, fitScale, isDoubleSpread);
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to init PDF:', err);
                }
            }
        }
        initPdf();

        return () => {
            isMounted = false;
            if (pdfRef.current) {
                try { pdfRef.current.destroy(); } catch { }
            }
        };
    }, [book.id, getFitScaleForPage, getSpreadStartPage, isDoubleSpread, renderPage]);

    // Re-render when page or scale changes
    useEffect(() => {
        if (!isInitializing) {
            renderPage(pageNum, scale, isDoubleSpread);
        }
    }, [pageNum, scale, isDoubleSpread, isInitializing, renderPage]);

    useEffect(() => {
        if (isInitializing) return;
        setPageNum((prev) => getSpreadStartPage(prev, isDoubleSpread));
    }, [getSpreadStartPage, isDoubleSpread, isInitializing]);

    // Register navigateTo + search
    useEffect(() => {
        const totalPages = numPages;
        const step = isDoubleSpread ? 2 : 1;
        useReaderStore.setState({
            navigateTo: (loc) => {
                const rawTarget = typeof loc === 'number' ? loc : parseInt(loc);
                const target = getSpreadStartPage(rawTarget, isDoubleSpread);
                if (!isNaN(target) && target >= 1 && target <= totalPages) {
                    setPageNum(target);
                }
            },
            prevPage: () => {
                setPageNum((prev) => Math.max(1, prev - step));
            },
            nextPage: () => {
                setPageNum((prev) => Math.min(totalPages, prev + step));
            },
            search: async (query: string) => {
                const pdf = pdfRef.current;
                if (!pdf) return;

                setSearching(true);
                setSearchResults([]);
                const results: any[] = [];

                try {
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const text = textContent.items.map((item: any) => item.str).join(' ');

                        const index = text.toLowerCase().indexOf(query.toLowerCase());
                        if (index !== -1) {
                            results.push({
                                page: i,
                                label: `Page ${i}`,
                                excerpt: '...' + text.substring(Math.max(0, index - 40), Math.min(text.length, index + query.length + 40)) + '...'
                            });
                        }
                        if (results.length > 50) break;
                    }
                    setSearchResults(results);
                } catch (err) {
                    console.error('PDF Search Error:', err);
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
    }, [getSpreadStartPage, isDoubleSpread, numPages, setSearching, setSearchResults]);

    const changePage = (offset: number) => {
        const step = isDoubleSpread ? 2 : 1;
        const target = offset > 0 ? pageNum + step : pageNum - step;
        if (target >= 1 && target <= numPages) {
            setPageNum(target);
        }
    };

    const handleZoom = (delta: number) => {
        setScale(prev => Math.min(Math.max(0.5, prev + delta), 4));
    };

    const resetZoomToFit = useCallback(async () => {
        if (!pdfRef.current) return;
        try {
            const page = await pdfRef.current.getPage(pageNum);
            setScale(getFitScaleForPage(page));
        } catch (err) {
            console.error('Failed to fit PDF to viewport:', err);
        }
    }, [getFitScaleForPage, pageNum]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-secondary)]">
            {/* Zoom Controls */}
            <div className="fixed bottom-24 right-8 flex flex-col gap-2 z-20">
                <button
                    onClick={() => handleZoom(0.25)}
                    className="p-3 glass border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-lg"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={() => handleZoom(-0.25)}
                    className="p-3 glass border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-lg"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={resetZoomToFit}
                    className="p-3 glass border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-lg"
                >
                    <Maximize size={20} />
                </button>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-auto p-8 flex justify-center items-start no-scrollbar"
            >
                <div className="relative shadow-2xl bg-white">
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                    {isRendering && (
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px]">
                            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="h-16 flex items-center justify-center gap-12 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-8">
                <button
                    onClick={() => changePage(-1)}
                    disabled={pageNum <= 1}
                    className="p-2 disabled:opacity-30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="text-sm font-medium text-[var(--text-secondary)]">
                    {isDoubleSpread ? (
                        <>Pages <span className="text-[var(--text-primary)]">{pageNum}-{Math.min(pageNum + 1, numPages)}</span> of {numPages}</>
                    ) : (
                        <>Page <span className="text-[var(--text-primary)]">{pageNum}</span> of {numPages}</>
                    )}
                </div>

                <button
                    onClick={() => changePage(1)}
                    disabled={pageNum + (isDoubleSpread ? 2 : 1) > numPages}
                    className="p-2 disabled:opacity-30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
