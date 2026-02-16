'use client';

import React from 'react';
import {
    Filter,
    ArrowUpDown,
    LayoutGrid,
    List,
    Check
} from 'lucide-react';
import { useLibraryStore, type FormatFilter, type BookSortOption } from '@/stores/libraryStore';
import { cn } from '@/lib/utils/cn';

export default function FilterBar() {
    const {
        formatFilter, setFormatFilter,
        sortBy, setSortBy,
        viewMode, setViewMode
    } = useLibraryStore();

    const formats: { value: FormatFilter; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'epub', label: 'eBooks' },
        { value: 'pdf', label: 'PDFs' },
        { value: 'comic', label: 'Comics' },
    ];

    const sortOptions: { value: BookSortOption; label: string }[] = [
        { value: 'added', label: 'Date Added' },
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        { value: 'lastReading', label: 'Last Read' },
    ];

    return (
        <div className="flex items-center justify-between w-full h-12 px-1">
            <div className="flex items-center gap-2">
                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]">
                    {formats.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFormatFilter(f.value)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                formatFilter === f.value
                                    ? "bg-[var(--accent)] text-white shadow-sm"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <ArrowUpDown size={14} />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as BookSortOption)}
                        className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[var(--text-primary)] font-medium"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[var(--bg-elevated)]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="h-6 w-[1px] bg-[var(--border)]" />

                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'grid'
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'list'
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
