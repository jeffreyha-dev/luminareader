import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReadingTheme = 'dark' | 'light' | 'sepia' | 'custom';
export type PageLayoutMode = 'single' | 'double' | 'continuous';

interface SettingsState {
    theme: ReadingTheme;
    customThemeBackground: string;
    customThemeText: string;
    fontSize: number;
    fontFamily: string;
    customFontFamily: string;
    lineHeight: number;
    margins: number;
    readingDirection: 'ltr' | 'rtl';
    comicMode: PageLayoutMode;

    // Actions
    setTheme: (theme: ReadingTheme) => void;
    setCustomThemeBackground: (color: string) => void;
    setCustomThemeText: (color: string) => void;
    setFontSize: (size: number) => void;
    setFontFamily: (family: string) => void;
    setCustomFontFamily: (family: string) => void;
    setLineHeight: (height: number) => void;
    setMargins: (margins: number) => void;
    setReadingDirection: (dir: 'ltr' | 'rtl') => void;
    setComicMode: (mode: PageLayoutMode) => void;
    resetToDefaults: () => void;
}

const DEFAULT_SETTINGS = {
    theme: 'dark' as ReadingTheme,
    customThemeBackground: '#121212',
    customThemeText: '#f5f5f5',
    fontSize: 18,
    fontFamily: 'serif',
    customFontFamily: '"Literata", "Times New Roman", serif',
    lineHeight: 1.6,
    margins: 40,
    readingDirection: 'ltr' as const,
    comicMode: 'single' as PageLayoutMode,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setTheme: (theme) => set({ theme }),
            setCustomThemeBackground: (customThemeBackground) => set({ customThemeBackground }),
            setCustomThemeText: (customThemeText) => set({ customThemeText }),
            setFontSize: (fontSize) => set({ fontSize }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setCustomFontFamily: (customFontFamily) => set({ customFontFamily }),
            setLineHeight: (lineHeight) => set({ lineHeight }),
            setMargins: (margins) => set({ margins }),
            setReadingDirection: (readingDirection) => set({ readingDirection }),
            setComicMode: (comicMode) => set({ comicMode }),

            resetToDefaults: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'lumina-settings',
        }
    )
);
