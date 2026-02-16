'use client';

import React, { useState } from 'react';
import {
    Library,
    BookOpen,
    Heart,
    Clock,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import CollectionManager from '@/components/library/CollectionManager';
import { useLibraryStore, type LibrarySection } from '@/stores/libraryStore';
import SettingsModal from '@/components/library/SettingsModal';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick }: SidebarItemProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center w-full h-12 transition-all duration-200 group relative",
                active
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            )}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />
            )}
            <div className={cn(
                "flex items-center justify-center h-full transition-all duration-300",
                collapsed ? "w-16" : "w-16" // Keep icon container consistent width
            )}>
                <Icon size={20} />
            </div>
            {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100">
                    {label}
                </span>
            )}
        </button>
    );
};

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { activeSection, setActiveSection, setSelectedCollection } = useLibraryStore();

    const handleTabClick = (id: LibrarySection) => {
        setActiveSection(id);
        if (id !== 'library') {
            setSelectedCollection(null);
        }
    };

    const navItems: { id: LibrarySection; icon: React.ElementType; label: string }[] = [
        { id: 'library', icon: Library, label: 'Library' },
        { id: 'reading', icon: BookOpen, label: 'Reading Now' },
        { id: 'favorites', icon: Heart, label: 'Favorites' },
        { id: 'recent', icon: Clock, label: 'Recently Added' },
    ];

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] transition-all duration-300 ease-in-out sticky top-0 z-50",
                collapsed ? "w-16" : "w-60"
            )}
        >
            <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
                {!collapsed && (
                    <span className="text-lg font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">
                        Lumina
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto no-scrollbar space-y-6">
                <div>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeSection === item.id}
                            collapsed={collapsed}
                            onClick={() => handleTabClick(item.id)}
                        />
                    ))}
                </div>

                {!collapsed && (
                    <div className="px-4">
                        <CollectionManager />
                    </div>
                )}
            </nav>

            <div className="p-2 border-t border-[var(--border)]">
                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    collapsed={collapsed}
                    onClick={() => setShowSettings(true)}
                />
            </div>
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </aside>
    );
}
