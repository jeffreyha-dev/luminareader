# QA Checklist

Last Updated: 2026-02-16

## Build Gate
- `npm run build` completes without errors.
- App loads at `/` and `/reader/[id]`.

## Library
- Import works for `.epub`, `.pdf`, `.cbz`.
- Unsupported files are skipped with a visible message.
- Search filters by title and author.
- Format filters return expected sets (All/eBooks/PDFs/Comics).
- Sort options reorder results correctly.
- Grid and list view both render covers/metadata.

## Reader Engines
- EPUB opens and page turns work by click zones and arrow keys.
- EPUB theme/font/line-height updates apply without re-opening the book.
- PDF opens and default zoom fits viewport.
- PDF double-page layout works in landscape when layout mode is `Double`.
- CBZ comic opens, supports single/double/continuous modes.
- Comic keyboard arrows and on-screen controls both navigate pages.

## Persistence
- Reading progress persists across reload.
- Bookmark create/delete persists.
- Reading session entries appear in stats after reading.
- Settings persist after refresh (`theme`, fonts, layout mode).

## UX and Accessibility
- Sidebar only has functional navigation enabled.
- Focus ring appears when navigating controls with keyboard.
- No debug-only text appears in production UI.

## Docs Alignment
- `docs/PRD.md` matches supported formats.
- `docs/development.md` matches current core stack.
- `docs/architecture.md` matches current reader engine implementation.
