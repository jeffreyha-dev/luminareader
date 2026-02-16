'use client';

import React, { useState } from 'react';
import { db } from '@/lib/storage/db';
import { X, Download, Upload, Shield, Database, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [exporting, setExporting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const exportData = async (type: 'json' | 'markdown') => {
        setExporting(true);
        try {
            const books = await db.books.toArray();
            const annotations = await db.annotations.toArray();
            const sessions = await db.reading_sessions.toArray();

            let content = '';
            let filename = `lumina-backup-${new Date().toISOString().split('T')[0]}`;

            if (type === 'json') {
                const backup = {
                    books: books.map(b => ({ ...b, fileBlob: null, coverBlob: null })), // Don't export binary blobs in JSON
                    annotations,
                    sessions,
                    exportedAt: new Date()
                };
                content = JSON.stringify(backup, null, 2);
                filename += '.json';
            } else {
                // Export annotations as Markdown
                content = '# LuminaReader Annotations Export\n\n';
                for (const book of books) {
                    const bookAnns = annotations.filter(a => a.bookId === book.id);
                    if (bookAnns.length > 0) {
                        content += `## ${book.title} (${book.author})\n\n`;
                        bookAnns.forEach(ann => {
                            content += `- **Page ${ann.page}**: ${ann.content} ${ann.type === 'note' ? `\n  - *Note: ${ann.content}*` : ''}\n`;
                        });
                        content += '\n---\n\n';
                    }
                }
                filename += '.md';
            }

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            setSuccessMsg(`Exported successfully as ${type.toUpperCase()}`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Database size={20} className="text-[var(--accent)]" />
                        Settings & Data
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Data Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Export Library Data</h3>
                            <p className="text-xs text-[var(--text-secondary)]">Download your annotations, reading history, and collection metadata. Note: Book files are not included in the JSON backup.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => exportData('json')}
                                disabled={exporting}
                                className="flex flex-col items-center gap-3 p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <Download size={20} />
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-[var(--text-primary)]">Download JSON</div>
                                    <div className="text-[10px] text-[var(--text-secondary)]">Full Metadata Backup</div>
                                </div>
                            </button>

                            <button
                                onClick={() => exportData('markdown')}
                                disabled={exporting}
                                className="flex flex-col items-center gap-3 p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    <FileText size={20} />
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-[var(--text-primary)]">Export Annotations</div>
                                    <div className="text-[10px] text-[var(--text-secondary)]">Markdown Format</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Privacy Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Privacy & Privacy</h3>
                            <p className="text-xs text-[var(--text-secondary)]">All your data is stored locally in your browser's IndexedDB. We never upload your files or reading history to any server.</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl flex items-center gap-4">
                            <Shield className="text-green-500" size={24} />
                            <div>
                                <div className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">Client-Side Only</div>
                                <div className="text-[10px] text-[var(--text-secondary)]">Your library is 100% private.</div>
                            </div>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg text-xs font-medium animate-in slide-in-from-bottom-2">
                            <CheckCircle2 size={16} />
                            {successMsg}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[var(--bg-elevated)] border-t border-[var(--border)] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
