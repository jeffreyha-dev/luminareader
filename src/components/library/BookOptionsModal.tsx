'use client';

import React, { useState, useEffect } from 'react';
import { db, BookRecord, CollectionRecord } from '@/lib/storage/db';
import { X, Save, Tag, Book, User, Image as ImageIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BookOptionsModalProps {
    book: BookRecord;
    onClose: () => void;
}

export default function BookOptionsModal({ book, onClose }: BookOptionsModalProps) {
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [collections, setCollections] = useState<CollectionRecord[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>(book.collections || []);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadCollections = async () => {
            const all = await db.collections.toArray();
            setCollections(all);
        };
        loadCollections();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update book record
            await db.books.update(book.id, {
                title,
                author,
                collections: selectedCollections
            });

            // Sync with collections table (add bookId to collections)
            for (const col of collections) {
                const isSelected = selectedCollections.includes(col.id);
                const hasBook = col.bookIds.includes(book.id);

                if (isSelected && !hasBook) {
                    await db.collections.update(col.id, {
                        bookIds: [...col.bookIds, book.id],
                        updatedAt: new Date()
                    });
                } else if (!isSelected && hasBook) {
                    await db.collections.update(col.id, {
                        bookIds: col.bookIds.filter(id => id !== book.id),
                        updatedAt: new Date()
                    });
                }
            }

            onClose();
        } catch (err) {
            console.error('Failed to save book options:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleCollection = (id: string) => {
        setSelectedCollections(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this book? This cannot be undone.')) return;

        try {
            await db.books.delete(book.id);
            // Cleanup collections
            for (const col of collections) {
                if (col.bookIds.includes(book.id)) {
                    await db.collections.update(col.id, {
                        bookIds: col.bookIds.filter(id => id !== book.id)
                    });
                }
            }
            onClose();
        } catch (err) {
            console.error('Failed to delete book:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Book size={20} className="text-[var(--accent)]" />
                        Book Settings
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Title</label>
                            <div className="relative">
                                <Book size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Author</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collections Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                            <Tag size={16} />
                            Manage Collections
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {collections.map(col => (
                                <button
                                    key={col.id}
                                    onClick={() => toggleCollection(col.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                        selectedCollections.includes(col.id)
                                            ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20"
                                            : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50"
                                    )}
                                >
                                    {col.name}
                                </button>
                            ))}
                            {collections.length === 0 && (
                                <p className="text-xs text-[var(--text-muted)] italic">Create collections in the sidebar first</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[var(--bg-elevated)] border-t border-[var(--border)] flex items-center justify-between gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
