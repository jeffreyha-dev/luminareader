import { create } from 'zustand';

export type LibraryViewMode = 'grid' | 'list';
export type BookSortOption = 'title' | 'author' | 'added' | 'lastReading';
export type FormatFilter = 'all' | 'epub' | 'pdf' | 'comic';
export type LibrarySection = 'library' | 'reading' | 'favorites' | 'recent';

interface LibraryState {
    viewMode: LibraryViewMode;
    activeSection: LibrarySection;
    searchQuery: string;
    formatFilter: FormatFilter;
    sortBy: BookSortOption;
    selectedCollection: string | null;

    // Actions
    setViewMode: (mode: LibraryViewMode) => void;
    setActiveSection: (section: LibrarySection) => void;
    setSearchQuery: (query: string) => void;
    setFormatFilter: (filter: FormatFilter) => void;
    setSortBy: (sort: BookSortOption) => void;
    setSelectedCollection: (collection: string | null) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
    viewMode: 'grid',
    activeSection: 'library',
    searchQuery: '',
    formatFilter: 'all',
    sortBy: 'added',
    selectedCollection: null,

    setViewMode: (viewMode) => set({ viewMode }),
    setActiveSection: (activeSection) => set({ activeSection }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setFormatFilter: (formatFilter) => set({ formatFilter }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSelectedCollection: (selectedCollection) => set({ selectedCollection }),
}));
