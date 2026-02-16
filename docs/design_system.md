# Design System Guidelines

## Core Philosophy
**"Immersive & Invisible"**
The interface should recede when reading, highlighting content foremost. We use a "Glassmorphism" aesthetic for panels and controls to maintain context.

## Color Palette

### Primary
- **Background:** `#0f172a` (Slate 950) - Deep, restful dark mode default.
- **Surface:** `#1e293b` (Slate 800) - Cards and panels.
- **Accent:** `#8b5cf6` (Violet 500) - Primary actions and highlights.
- **Text:** `#f8fafc` (Slate 50) - High readability.

### Semantic
- **Success:** `#22c55e` (Green 500)
- **Warning:** `#f59e0b` (Amber 500)
- **Error:** `#ef4444` (Red 500)

## Typography
- **Primary Font:** `Inter` (UI elements, sans-serif).
- **Reading Font:** `Merriweather` (Serif, optimized for long-form reading).

## Components

### Buttons
- **Primary:** Violet background, white text, rounded-full.
- **Ghost:** Transparent background, white text, hover effect.
- **Icon:** Circular, strictly for navigation/actions.

### Cards (Book Covers)
- **Aspect Ratio:** roughly 2:3 (standard book size).
- **Hover:** Slight scale up (1.05x) and shadow glow.
- **Metadata:** Title/Author overlaid or beneath based on view mode.

### Modals
- **Backdrop:** Blur-md (Glass effect).
- **Animation:** Fade in + Scale up.

## Accessibility
- **Focus States:** All interactive elements must have visible focus rings.
- **Contrast:** Maintain AA standard (4.5:1) for text.
- **Keyboard Nav:** Complete support for library navigation and page turning.
