'use client';

import React, { useState } from 'react';
import { X, Search as SearchIcon, Loader2, ChevronRight } from 'lucide-react';
import { useReaderStore } from '@/stores/readerStore';
import { cn } from '@/lib/utils/cn';

export default function SearchPanel() {
    const {
        activePanel,
        setActivePanel,
        search,
        searchResults,
        isSearching,
        navigateTo
    } = useReaderStore();
    const [query, setQuery] = useState('');

    if (activePanel !== 'search') return null;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        await search(query);
    };

    const handleResultClick = (result: any) => {
        navigateTo(result.cfi || result.page);
        setActivePanel(null); // Close panel on navigation
    };

    return (
        <div className="fixed inset-y-0 right-0 w-80 glass border-l border-[var(--border)] z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <SearchIcon size={20} /> Search
                </h2>
                <button
                    onClick={() => setActivePanel(null)}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-4 border-b border-[var(--border)]">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search in book..."
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 ring-[var(--accent)] outline-none"
                        autoFocus
                    />
                    <SearchIcon size={16} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <Loader2 size={24} className="text-[var(--accent)] animate-spin" />
                        <p className="text-xs text-[var(--text-secondary)] font-medium">Scanning index...</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                        <p className="px-3 py-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            {searchResults.length} results found
                        </p>
                        {searchResults.map((result, i) => (
                            <button
                                key={i}
                                onClick={() => handleResultClick(result)}
                                className="w-full text-left p-3 rounded-xl hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border)] transition-all group"
                            >
                                <p className="text-xs text-[var(--text-secondary)] mb-1 flex items-center justify-between">
                                    <span>{result.label}</span>
                                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </p>
                                <p
                                    className="text-sm text-[var(--text-primary)] line-clamp-3 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: result.excerpt.replace(
                                            new RegExp(`(${query})`, 'gi'),
                                            '<mark class="bg-[var(--accent)]/30 text-[var(--accent)] rounded px-0.5">$1</mark>'
                                        )
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                ) : query ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                        <SearchIcon size={32} className="text-[var(--border)]" />
                        <p className="text-sm text-[var(--text-secondary)] italic">
                            No results found for "{query}"
                        </p>
                    </div>
                ) : (
                    <div className="text-center space-y-2 py-20 px-6">
                        <SearchIcon size={32} className="mx-auto text-[var(--border)]" />
                        <p className="text-xs text-[var(--text-secondary)]">
                            Search for keywords or phrases across the entire book.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
