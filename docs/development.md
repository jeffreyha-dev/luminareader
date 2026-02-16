# Technical Guide

## Setup & installation
LuminaReader is a Next.js application.

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/jeffreyha-dev/luminareader.git
cd luminareader
npm install
npm run dev
```

## Project Structure
```
/src
  /app          # Next.js App Router pages
  /components
    /library    # Library view components (Grid, Import, etc.)
    /reader     # Reader view components (EPUB, PDF, Comic engines)
  /lib
    /storage    # Dexie.js database configuration
    /utils      # Helper functions (file parsing, metadata)
  /stores       # Zustand state management
```

## Key Technologies
- **Next.js 16:** Framework & Routing
- **Tailwind CSS:** Styling
- **Dexie.js:** IndexedDB wrapper for local storage
- **pdfjs-dist / epubjs:** Reading engines
- **zip.js:** Comic archive extraction

## Contribution Workflow
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## Testing
Currently, we rely on manual verification. Ensure:
- Uploads work for all supported formats.
- Persistence works across page reloads.
- Responsive layout breaks correctly on mobile.
