'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ShortcutHelpOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHORTCUTS = [
    {
        category: 'Navigation', keys: [
            { key: 'H', desc: 'Go back to Library' },
            { key: '?', desc: 'Show/Hide this help' },
            { key: 'Esc', desc: 'Back / Close Panel' },
        ]
    },
    {
        category: 'Reader', keys: [
            { key: '→ / ↓', desc: 'Next Page' },
            { key: '← / ↑', desc: 'Previous Page' },
            { key: 'F', desc: 'Toggle Fullscreen' },
            { key: 'T', desc: 'Toggle Table of Contents' },
            { key: 'B', desc: 'Toggle Bookmark' },
            { key: 'S', desc: 'Open Settings' },
        ]
    },
    {
        category: 'General', keys: [
            { key: '/', desc: 'Search' },
            { key: '[', desc: 'Previous Tab/Panel' },
            { key: ']', desc: 'Next Tab/Panel' },
        ]
    }
];

export default function ShortcutHelpOverlay({ isOpen, onClose }: ShortcutHelpOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Keyboard Shortcuts</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {SHORTCUTS.map((cat) => (
                        <div key={cat.category}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-4">
                                {cat.category}
                            </h3>
                            <div className="space-y-3">
                                {cat.keys.map((s) => (
                                    <div key={s.key} className="flex items-center justify-between group">
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {s.desc}
                                        </span>
                                        <kbd className="px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded shadow-sm text-xs font-mono text-[var(--text-primary)] min-w-[2.5rem] text-center group-hover:border-[var(--accent)]/50 transition-colors">
                                            {s.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                    Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded font-mono">Any Key</kbd> to continue reading
                </div>
            </div>
        </div>
    );
}
