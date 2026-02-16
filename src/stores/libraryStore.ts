import { create } from 'zustand';

export type LibraryViewMode = 'grid' | 'list';
export type BookSortOption = 'title' | 'author' | 'added' | 'lastReading';
export type FormatFilter = 'all' | 'epub' | 'pdf' | 'comic';

interface LibraryState {
    viewMode: LibraryViewMode;
    searchQuery: string;
    formatFilter: FormatFilter;
    sortBy: BookSortOption;
    selectedCollection: string | null;

    // Actions
    setViewMode: (mode: LibraryViewMode) => void;
    setSearchQuery: (query: string) => void;
    setFormatFilter: (filter: FormatFilter) => void;
    setSortBy: (sort: BookSortOption) => void;
    setSelectedCollection: (collection: string | null) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
    viewMode: 'grid',
    searchQuery: '',
    formatFilter: 'all',
    sortBy: 'added',
    selectedCollection: null,

    setViewMode: (viewMode) => set({ viewMode }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setFormatFilter: (formatFilter) => set({ formatFilter }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSelectedCollection: (selectedCollection) => set({ selectedCollection }),
}));
