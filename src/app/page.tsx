'use client';

import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/library/SearchBar';
import FilterBar from '@/components/library/FilterBar';
import ImportZone from '@/components/library/ImportZone';
import BookGrid from '@/components/library/BookGrid';
import StatsDashboard from '@/components/library/StatsDashboard';
import { useLibraryStore } from '@/stores/libraryStore';

export default function LibraryPage() {
  const { searchQuery, formatFilter, activeSection } = useLibraryStore();
  const sectionTitle: Record<string, string> = {
    library: 'Your Books',
    reading: 'Reading Now',
    favorites: 'Favorites',
    recent: 'Recently Added',
  };

  return (
    <>
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)]">
        {/* Header */}
        <header className="flex flex-col gap-4 p-6 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                My Library
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Your personal reading collection
              </p>
            </div>

            <SearchBar />

            <div className="w-48">
              <ImportZone />
            </div>
          </div>

          <FilterBar />
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex-shrink-0 flex flex-col max-w-[1400px] w-full mx-auto p-6 space-y-8">
            {!searchQuery && formatFilter === 'all' && activeSection === 'library' && (
              <div className="flex-shrink-0">
                <StatsDashboard />
              </div>
            )}

            <section className="flex-1 flex flex-col min-h-[500px]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex-shrink-0">
                {searchQuery ? `Search results for "${searchQuery}"` : sectionTitle[activeSection] ?? 'Your Books'}
              </h2>
              <div className="flex-1 min-h-0 relative">
                <BookGrid />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
