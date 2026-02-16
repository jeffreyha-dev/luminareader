'use client';

import React, { useState, useEffect } from 'react';
import { db, CollectionRecord } from '@/lib/storage/db';
import { Plus, Tag, X, FolderPlus, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLibraryStore } from '@/stores/libraryStore';

export default function CollectionManager() {
    const [collections, setCollections] = useState<CollectionRecord[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const { selectedCollection, setSelectedCollection } = useLibraryStore();

    useEffect(() => {
        const load = async () => {
            const all = await db.collections.toArray();
            setCollections(all);
        };
        load();
    }, []);

    const createCollection = async () => {
        if (!newName.trim()) return;
        const newCol: CollectionRecord = {
            id: crypto.randomUUID(),
            name: newName.trim(),
            description: '',
            bookIds: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await db.collections.add(newCol);
        setCollections([...collections, newCol]);
        setNewName('');
        setIsCreating(false);
    };

    const deleteCollection = async (id: string) => {
        await db.collections.delete(id);
        if (selectedCollection === id) setSelectedCollection(null);
        setCollections(collections.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                    <Tag size={14} />
                    Collections
                </h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="p-1 hover:bg-[var(--bg-elevated)] rounded-md text-[var(--text-secondary)] transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {collections.map(col => (
                    <div
                        key={col.id}
                        onClick={() => setSelectedCollection(col.id === selectedCollection ? null : col.id)}
                        className={cn(
                            "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm",
                            selectedCollection === col.id
                                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        )}
                    >
                        <span className="flex items-center gap-3">
                            <div className={cn(
                                "w-2 h-2 rounded-full transition-opacity",
                                selectedCollection === col.id ? "bg-white opacity-100" : "bg-[var(--accent)] opacity-40 group-hover:opacity-100"
                            )} />
                            {col.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border",
                                selectedCollection === col.id ? "bg-white/20 border-white/30" : "bg-[var(--bg-primary)] border-[var(--border)]"
                            )}>
                                {col.bookIds.length}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCollection(col.id);
                                }}
                                className={cn(
                                    "p-1",
                                    selectedCollection === col.id ? "hover:text-red-200" : "hover:text-red-400"
                                )}
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                {isCreating && (
                    <div className="px-3 py-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Collection name..."
                            className="w-full bg-[var(--bg-elevated)] border border-[var(--accent)]/30 rounded px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') createCollection();
                                if (e.key === 'Escape') setIsCreating(false);
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={createCollection}
                                className="flex-1 bg-[var(--accent)] text-white text-[10px] font-bold py-1 rounded"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[10px] font-bold py-1 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {collections.length === 0 && !isCreating && (
                    <div className="px-3 py-4 text-center">
                        <p className="text-xs text-[var(--text-secondary)] italic">No collections yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
