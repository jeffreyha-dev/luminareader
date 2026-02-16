import { create } from 'zustand';
import { BookRecord } from '@/lib/storage/db';

interface ReaderState {
    currentBook: BookRecord | null;
    isToolbarVisible: boolean;
    activePanel: 'settings' | 'navigation' | 'search' | 'bookmarks' | 'annotations' | null;
    toc: any[] | null;
    bookmarks: any[];
    searchResults: any[];
    isSearching: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentBook: (book: BookRecord | null) => void;
    setToolbarVisible: (visible: boolean) => void;
    setActivePanel: (panel: 'settings' | 'navigation' | 'search' | 'bookmarks' | 'annotations' | null) => void;
    setToc: (toc: any[] | null) => void;
    setBookmarks: (bookmarks: any[]) => void;
    setSearchResults: (results: any[]) => void;
    setSearching: (isSearching: boolean) => void;
    search: (query: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateProgress: (progress: number, page: number) => void;
    navigateTo: (location: string | number) => void;
    prevPage: () => void;
    nextPage: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
    currentBook: null,
    isToolbarVisible: true,
    activePanel: null,
    toc: null,
    bookmarks: [],
    searchResults: [],
    isSearching: false,
    isLoading: true,
    error: null,

    setCurrentBook: (book) => set({ currentBook: book, isLoading: false, error: null }),
    setToolbarVisible: (isToolbarVisible) => set({ isToolbarVisible }),
    setActivePanel: (activePanel) => set({ activePanel }),
    setToc: (toc) => set({ toc }),
    setBookmarks: (bookmarks) => set({ bookmarks }),
    setSearchResults: (searchResults) => set({ searchResults }),
    setSearching: (isSearching) => set({ isSearching }),
    search: async () => { }, // To be overridden by engines
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
    updateProgress: (progress, page) => set((state) => ({
        currentBook: state.currentBook ? { ...state.currentBook, progress, currentPage: page } : null
    })),
    navigateTo: () => { }, // To be overridden by engines
    prevPage: () => { }, // To be overridden by engines
    nextPage: () => { }, // To be overridden by engines
}));
