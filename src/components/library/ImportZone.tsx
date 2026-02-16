'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { extractMetadata } from '@/lib/utils/metadata';
import { db } from '@/lib/storage/db';

export default function ImportZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const supportedFormats = new Set(['epub', 'pdf', 'cbz']);
        const unsupportedFiles: string[] = [];

        setIsImporting(true);
        try {
            for (const file of Array.from(files)) {
                const format = file.name.split('.').pop()?.toLowerCase();
                if (!format || !supportedFormats.has(format)) {
                    unsupportedFiles.push(file.name);
                    continue;
                }

                const metadata = await extractMetadata(file);

                await db.books.add({
                    id: crypto.randomUUID(),
                    title: metadata.title,
                    author: metadata.author,
                    format: format as any,
                    coverBlob: metadata.coverBlob,
                    fileBlob: file, // Storing the actual file
                    fileSize: file.size,
                    addedAt: new Date(),
                    lastReadAt: null,
                    progress: 0,
                    currentPage: 1,
                    totalPages: metadata.totalPages,
                    collections: [],
                    metadata: {}
                });
            }

            if (unsupportedFiles.length > 0) {
                alert(`Skipped unsupported files:\n${unsupportedFiles.join('\n')}`);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import some files.');
        } finally {
            setIsImporting(false);
            setIsDragging(false);
        }
    }, []);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
                "relative group cursor-pointer transition-all duration-300",
                isDragging ? "scale-[1.02]" : ""
            )}
        >
            <input
                type="file"
                multiple
                accept=".epub,.pdf,.cbz"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className={cn(
                "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all",
                isDragging
                    ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-elevated)]"
            )}>
                {isImporting ? (
                    <>
                        <Loader2 size={32} className="text-[var(--accent)] animate-spin mb-3" />
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Importing books...</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Extracting metadata and covers</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)] text-center">
                            Import Content
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 text-center">
                            Drag & drop EPUB, PDF, or CBZ files here
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
