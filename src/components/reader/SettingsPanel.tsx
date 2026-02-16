'use client';

import React from 'react';
import { X, Type, Sun, Moon, Coffee, Palette, BookOpen, Columns2, ScrollText } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useReaderStore } from '@/stores/readerStore';
import { cn } from '@/lib/utils/cn';

export default function SettingsPanel() {
    const {
        theme, setTheme,
        customThemeBackground, setCustomThemeBackground,
        customThemeText, setCustomThemeText,
        fontSize, setFontSize,
        fontFamily, setFontFamily,
        customFontFamily, setCustomFontFamily,
        lineHeight, setLineHeight,
        comicMode, setComicMode
    } = useSettingsStore();

    const { activePanel, setActivePanel } = useReaderStore();

    if (activePanel !== 'settings') return null;

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, bg: '#ffffff', text: '#1a1a1a' },
        { id: 'sepia', name: 'Sepia', icon: Coffee, bg: '#f4ecd8', text: '#3d3126' },
        { id: 'dark', name: 'Dark', icon: Moon, bg: '#0f0f1a', text: '#e8e8f0' },
        { id: 'custom', name: 'Custom', icon: Palette, bg: customThemeBackground, text: customThemeText },
    ];

    const fonts = [
        { id: 'sans-serif', name: 'Sans Serif' },
        { id: 'serif', name: 'Serif' },
        { id: 'monospace', name: 'Monospace' },
        { id: 'dyslexic', name: 'Dyslexic Friendly' },
        { id: 'custom', name: 'Custom Stack' },
    ];

    const layoutModes = [
        { id: 'single', name: 'Single', icon: BookOpen },
        { id: 'double', name: 'Double (Landscape)', icon: Columns2 },
        { id: 'continuous', name: 'Continuous', icon: ScrollText },
    ];

    return (
        <div className="fixed inset-y-0 right-0 w-80 glass border-l border-[var(--border)] z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Type size={20} /> Appearance
                </h2>
                <button
                    onClick={() => setActivePanel(null)}
                    className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Theme Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id as any)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                    theme === t.id
                                        ? "border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/20"
                                        : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--text-secondary)]"
                                )}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                                    style={{ backgroundColor: t.bg, color: t.text }}
                                >
                                    <t.icon size={20} />
                                </div>
                                <span className="text-[11px] font-medium">{t.name}</span>
                            </button>
                        ))}
                    </div>
                    {theme === 'custom' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <label className="text-xs text-[var(--text-secondary)]">
                                Background
                                <input
                                    type="color"
                                    value={customThemeBackground}
                                    onChange={(e) => setCustomThemeBackground(e.target.value)}
                                    className="mt-1 h-9 w-full rounded border border-[var(--border)] bg-transparent cursor-pointer"
                                />
                            </label>
                            <label className="text-xs text-[var(--text-secondary)]">
                                Text
                                <input
                                    type="color"
                                    value={customThemeText}
                                    onChange={(e) => setCustomThemeText(e.target.value)}
                                    className="mt-1 h-9 w-full rounded border border-[var(--border)] bg-transparent cursor-pointer"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Font Size Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Font Size</label>
                        <span className="text-sm font-medium">{fontSize}px</span>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="32"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                    />
                </div>

                {/* Font Family Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Typography</label>
                    <div className="flex flex-col gap-2">
                        {fonts.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFontFamily(f.id)}
                                className={cn(
                                    "text-left px-4 py-3 rounded-xl border transition-all",
                                    fontFamily === f.id
                                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-bold"
                                        : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                                )}
                                style={{ fontFamily: f.id }}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                    {fontFamily === 'custom' && (
                        <input
                            type="text"
                            value={customFontFamily}
                            onChange={(e) => setCustomFontFamily(e.target.value)}
                            placeholder='"Atkinson Hyperlegible", "Georgia", serif'
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)]"
                        />
                    )}
                </div>

                {/* Line Height Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Line Height</label>
                    <div className="flex gap-2">
                        {[1.2, 1.4, 1.6, 1.8].map((lh) => (
                            <button
                                key={lh}
                                onClick={() => setLineHeight(lh)}
                                className={cn(
                                    "flex-1 py-2 rounded-lg border transition-all text-sm",
                                    lineHeight === lh
                                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-bold"
                                        : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                )}
                            >
                                {lh}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Page Layout Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Page Layout</label>
                    <div className="grid grid-cols-1 gap-2">
                        {layoutModes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setComicMode(mode.id as any)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                                    comicMode === mode.id
                                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                                        : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                                )}
                            >
                                <span>{mode.name}</span>
                                <mode.icon size={16} />
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                        Double-page is automatically used only on landscape screens.
                    </p>
                </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]/50">
                <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    LuminaReader v1.0
                </p>
            </div>
        </div>
    );
}
