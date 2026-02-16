# LuminaReader Product Roadmap

## Current Status: Alpha (v0.1.0)
The core reading experience is functional for local files (EPUB, PDF, CBZ). The library management system is in place with metadata extraction and basic persistence.

## Phase 1: Core Experience (Current)
Focus on stability, file support, and basic reading features.

- [x] **Library Management**
  - [x] Drag & drop import
  - [x] Metadata extraction (Cover, Title, Author)
  - [x] IndexedDB storage
  - [x] Grid/List views (Fixed & Stable)
- [x] **Reader Engines**
  - [x] PDF Viewer (Fit-to-width/height, Zoom)
  - [x] EPUB Reader (Basic pagination)
  - [x] Comic Reader (CBZ support)
- [x] **Navigation**
  - [x] Keyboard shortcuts (Arrow keys)
  - [x] Reading progress tracking
  - [x] Session tracking (Stats)

## Phase 2: Refinement & Performance
Address technical debt and improve rendering performance.

- [ ] **Virtualization 2.0 (Deferred)**
  - Skipped for now. Keep stable non-virtualized Grid/List rendering until layout constraints are redesigned.
- [x] **Advanced Settings**
  - [x] Custom themes/fonts for EPUB.
  - [x] Double-page view for Comics/PDFs on landscape.
  - [x] Reading direction control (LTR/RTL) for page-turn behavior.
- [ ] **PWA Polish**
  - Service worker caching strategies.
  - Install prompt optimization.
- [ ] **CBR Support (Deferred)**
  - Keep user messaging clear and support CBZ as the stable comic format for now.

## Phase 3: Organization & Sync
Enhance how users manage their collections.

- [ ] **Collections/Tags**
  - Create custom collections.
  - Batch organize.
- [ ] **Cloud Sync (Optional/Future)**
  - Google Drive / Dropbox integration for backups.

## Phase 4: Social & Discovery
- [ ] **Reading Stats Export**
- [ ] **Goodreads Integration**

---
*Last Updated: 2026-02-16*
