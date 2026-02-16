# LuminaReader Implementation Plan

Last Updated: 2026-02-16

## Objective
Stabilize core UX for Alpha and prepare a clean path to Beta by fixing feature mismatches, reader reliability issues, and design-system consistency gaps.

## Scope
- In scope: correctness, UX clarity, reader behavior, accessibility, docs alignment, manual QA matrix.
- Out of scope: library virtualization (deferred), cloud sync, social integrations.

## Phase 1: Correctness and Trust (P0)
Target: Week 1

1. CBR support truthfulness
- Implement real CBR metadata + reader loading, or remove CBR from import/filter/UI copy until complete.
- Files: `src/components/library/ImportZone.tsx`, `src/lib/utils/metadata.ts`, `src/components/reader/engines/ComicViewer.tsx`, `docs/PRD.md`, `docs/user_guide.md`.

2. Sidebar behavior alignment
- Make non-library tabs functional (with actual filters/routes), or hide/disable them with clear “coming soon” state.
- Files: `src/components/Sidebar.tsx`, `src/app/page.tsx`, related store(s).

3. Library polish cleanup
- Remove debug `DB Query` badge from production UI.
- Files: `src/components/library/BookGrid.tsx`.

Acceptance criteria
- No UI element claims a capability that does not work.
- Sidebar interactions always produce visible functional changes.

## Phase 2: Reader Stability and UX (P0/P1)
Target: Week 2

1. EPUB settings performance
- Refactor EPUB initialization so theme/font changes apply without full engine teardown/reinit.
- Files: `src/components/reader/engines/EPUBViewer.tsx`.

2. Stats dashboard reactivity
- Make stats update when reading sessions change (live query or refresh trigger).
- Files: `src/components/library/StatsDashboard.tsx`, session write points.

3. Spread mode hardening
- Validate edge behavior for PDF/comic double-page (first/last page, RTL, portrait fallback).
- Files: `src/components/reader/engines/PDFViewer.tsx`, `src/components/reader/engines/ComicViewer.tsx`.

Acceptance criteria
- Appearance changes in EPUB feel instant (no reader reset flash).
- Stats reflect new reading sessions without page reload.
- Double-page mode behaves predictably across orientation changes.

## Phase 3: Design System and Accessibility (P1)
Target: Week 3

1. Focus visibility baseline
- Add consistent `:focus-visible` styles for all interactive controls.
- Files: `src/app/globals.css`, key components under `src/components/library` and `src/components/reader`.

2. Utility consistency pass
- Define and standardize shared utility classes used in UI (`glass-card`, `no-scrollbar`, motion classes strategy).
- Files: `src/app/globals.css`, component usages.

3. Typography preview correctness
- Fix font preview mapping for `custom` and `dyslexic` settings.
- Files: `src/components/reader/SettingsPanel.tsx`.

Acceptance criteria
- Keyboard-only navigation has visible focus on every actionable element.
- Visual tokens/utilities are defined once and reused consistently.

## Phase 4: Documentation and QA Gate (P1)
Target: Week 4

1. Documentation sync
- Update docs to match codebase versions, libraries, and supported formats.
- Files: `docs/development.md`, `docs/architecture.md`, `docs/PRD.md`, `docs/user_guide.md`.

2. Manual QA checklist
- Add repeatable smoke checklist for: import, filtering, reading engines, progress/session tracking, settings persistence.
- File: `docs/qa_checklist.md` (new).

3. Release readiness pass
- Run `npm run build` and full manual smoke test before tagging next alpha.

Acceptance criteria
- Docs no longer conflict with implementation.
- Team can validate release readiness from a single checklist.

## Risks and Mitigation
1. CBR parser instability
- Mitigation: gate behind capability flag and fallback messaging.

2. EPUB runtime regressions during refactor
- Mitigation: isolate init and style-update paths; keep current flow behind quick rollback branch.

3. UX drift from incremental fixes
- Mitigation: enforce component-level visual review using the design-system checklist.

## Definition of Done (This Plan)
- All Phase 1 items complete.
- At least two Phase 2 items complete.
- Build passes (`npm run build`).
- Docs updated for any changed behavior.
