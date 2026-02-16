'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useLibraryStore } from '@/stores/libraryStore';

export default function SearchBar() {
    const { searchQuery, setSearchQuery } = useLibraryStore();

    return (
        <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-muted)]">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full h-10 pl-10 pr-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                placeholder="Search title, author, or series..."
            />
        </div>
    );
}
