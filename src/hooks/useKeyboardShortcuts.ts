import { useEffect } from 'react';

type KeyCombo = string;
type ShortcutAction = (e: KeyboardEvent) => void;

interface ShortcutMap {
    [key: KeyCombo]: ShortcutAction;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, active: boolean = true) {
    useEffect(() => {
        if (!active) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger if focus is in an input or textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            const key = event.key;
            const ctrl = event.ctrlKey || event.metaKey;
            const shift = event.shiftKey;
            const alt = event.altKey;

            // Construct combo string: Shift+Ctrl+Alt+Key
            let combo = '';
            if (shift) combo += 'Shift+';
            if (ctrl) combo += 'Ctrl+';
            if (alt) combo += 'Alt+';
            combo += key;

            // Also support simple key match
            const action = shortcuts[combo] || shortcuts[key];

            if (action) {
                event.preventDefault();
                action(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, active]);
}
