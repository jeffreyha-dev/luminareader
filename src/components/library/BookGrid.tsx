'use client';
// @ts-nocheck

import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type BookRecord } from '@/lib/storage/db';
import { useLibraryStore } from '@/stores/libraryStore';
import BookCard from './BookCard';

export default function BookGrid() {
    const { searchQuery, formatFilter, sortBy, viewMode, selectedCollection, activeSection } = useLibraryStore();
    const emptyMessageBySection: Record<string, string> = {
        library: "Your library is empty. Import some books to get started.",
        reading: "You have no books in progress yet.",
        favorites: "No favorite books yet. Mark books as favorite in Book Options.",
        recent: "No books added recently.",
    };

    const books = useLiveQuery(async () => {
        let results = await db.books.toArray();

        if (formatFilter !== 'all') {
            results = results.filter((b: BookRecord) => {
                const fmt = (b.format || '').toLowerCase();
                if (formatFilter === 'comic') {
                    return fmt === 'cbz' || fmt === 'cbr' || fmt === 'comic';
                }
                return fmt === formatFilter;
            });
        }

        if (activeSection === 'reading') {
            results = results.filter((b: BookRecord) => b.progress > 0 && b.progress < 100);
        } else if (activeSection === 'favorites') {
            results = results.filter((b: BookRecord) => Boolean(b.metadata?.favorite));
        } else if (activeSection === 'recent') {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 14);
            results = results.filter((b: BookRecord) => b.addedAt >= cutoff);
        }

        if (selectedCollection) {
            results = results.filter((b: BookRecord) =>
                b.collections?.includes(selectedCollection)
            );
        }

        results.sort((a: any, b: any) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            if (sortBy === 'added') return b.addedAt.getTime() - a.addedAt.getTime();
            if (sortBy === 'lastReading') {
                const timeA = a.lastReadAt?.getTime() || 0;
                const timeB = b.lastReadAt?.getTime() || 0;
                return timeB - timeA;
            }
            return 0;
        });

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            results = results.filter((b: BookRecord) =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q)
            );
        }

        return results;
    }, [searchQuery, formatFilter, sortBy, selectedCollection, activeSection]);

    if (!books) return (
        // ... (existing loader - unchanged)
        <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-[var(--bg-elevated)] rounded-full mb-4" />
                <div className="h-4 w-32 bg-[var(--bg-elevated)] rounded" />
            </div>
        </div>
    );

    if (books.length === 0) {
        return (
            // ... (existing empty state - unchanged)
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4 text-[var(--text-muted)] border border-[var(--border)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">No books found</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">
                    {searchQuery
                        ? `No matches for "${searchQuery}" in your library.`
                        : emptyMessageBySection[activeSection] ?? emptyMessageBySection.library}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full h-full min-h-[400px] border border-dashed border-[var(--border)] overflow-y-auto">
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-4">
                    {books.map((book: BookRecord) => (
                        <BookCard key={book.id} book={book} viewMode="grid" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2 p-4">
                    {books.map((book: BookRecord) => (
                        <BookCard key={book.id} book={book} viewMode="list" />
                    ))}
                </div>
            )}
        </div>
    );
}
