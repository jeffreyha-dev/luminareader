# Architecture Overview

## System Context
LuminaReader is a client-side web application built with Next.js. It operates entirely within the user's browser, leveraging modern web APIs for file handling and storage.

### High-Level Architecture
```mermaid
graph TD
    User[User] -->|Interacts via| UI[Web Interface (Next.js)]
    UI -->|Reads/Writes| DB[(IndexedDB / Dexie.js)]
    UI -->|Parses| FileSystem[Local File System (Drag & Drop)]
    UI -->|Renders| Canvas[Canvas / HTML Layer]
```

## Core Components

### 1. Library System (`src/components/library`)
- **Responsibility:** Manages the collection of books.
- **Key Modules:**
  - `ImportZone`: Handles file uploads and metadata extraction.
  - `BookGrid`: Displays books in a responsive grid/list.
  - `LibraryStore`: Zustand store for UI state (search, filters).
  - `LiveQuery`: Real-time data binding from Dexie.js.

### 2. Reader Engine (`src/components/reader`)
- **Responsibility:** Renders book content based on format.
- **Engines:**
  - `EPUBViewer`: Uses `epubjs` for reflowable text.
  - `PDFViewer`: Uses `pdfjs-dist` for document rendering.
  - `ComicViewer`: ZIP image extraction + image-based spread/continuous rendering.

### 3. Storage Layer (`src/lib/storage`)
- **Technology:** IndexedDB via Dexie.js wrapper.
- **Schema:**
  - `books`: Stores metadata and binary blobs (covers).
  - `reading_sessions`: Tracks time spent and progress.
  - `bookmarks`: User saved positions.

## Key Technical Decisions
- **Client-Side Storage:** We chose IndexedDB over LocalStorage to handle large binary blobs (book covers) and structural data without blocking the main thread.
- **No Backend:** To maximize privacy and minimize cost, the app has zero server dependencies beyond serving the static assets.
- **Canvas for Comics:** Allows high-performance scaling and manipulation of high-res image files compared to standard DOM elements.
