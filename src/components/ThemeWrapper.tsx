'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const theme = useSettingsStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <>{children}</>;
}
