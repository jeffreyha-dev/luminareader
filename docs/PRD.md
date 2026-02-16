# Product Requirements Document (PRD)

## Executive Summary
LuminaReader is a modern, lightweight, local-first web-based e-reader designed to provide a premium reading experience for EPUB, PDF, and Comic (CBZ) formats. It focuses on privacy, performance, and aesthetics, eliminating the need for account sign-ups or server-side storage.

## Problem Statement
- **User Pain Points:**
    - Existing web readers often feel clunky or dated.
    - Privacy concerns with cloud-based reading solutions.
    - Lack of unified support for multiple formats (e.g., separate apps for comics and ebooks).
- **Goal:** Create a "beautifully simple" reader that respects user privacy and runs entirely in the browser.

## Specifications

### Core Features (MVP)
1.  **Library Management**
    - Drag-and-drop file import.
    - Metadata extraction (Cover, Title, Author).
    - Local storage using IndexedDB (via Dexie.js).
    - Filtering (All, eBook, PDF, Comic) and Sorting (Date Added, Title, progress).
2.  **Reader Engines**
    - **EPUB:** Pagination, font sizing, chapter navigation.
    - **PDF:** Vertical scroll, fit-to-width/height, zoom controls.
    - **Comics:** Single/Double page views, immersive mode.
    - **Navigation Direction:** LTR/RTL reading direction for page-turn controls.
3.  **Progress Tracking**
    - Auto-save reading progress.
    - Reading stats (time read, pages turned, streaks).

### Technical Requirements
- **Local-First:** No backend servers for book storage; all data lives in the browser.
- **Performance:** Virtualized lists for large libraries; efficient rendering for heavy PDF/CBZ files.
- **Responsive:** Works seamlessly on desktop and tablet viewports.

## User Stories
- *As a reader, I want to drag and drop a folder of books so that I can bulk import my library.*
- *As a comic fan, I want to read `.cbz` files with a double-page spread on my landscape tablet.*
- *As a privacy-conscious user, I want to ensure my reading habits aren't tracked by a third-party server.*

## Implementation Scope
| Feature | Priority | Status |
| :--- | :--- | :--- |
| Library Grid/List | P0 | Complete |
| EPUB Parsing | P0 | Complete |
| PDF Rendering | P0 | Complete |
| CBZ Support | P1 | Complete |
| CBR Support | P2 | Planned |
| PWA Support | P2 | In Progress |
| Cloud Sync (BYO) | P3 | Planned |
