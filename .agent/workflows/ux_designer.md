---
description: UX Designer workflow for user research, design system, prototyping, and usability testing
---

# UX Designer Workflow

This workflow guides the process of creating user-centric designs, from research and conceptualization to high-fidelity prototyping and engineering handoff.

## Phase 1: Empathize & Define (Research)

1.  **Stakeholder Interviews**
    *   Understand business goals and technical constraints.
    *   Interview key stakeholders (PM, Engineering, Sales/Support).
    *   Define what "success" looks like from a design perspective.

2.  **User Research**
    *   **Qualitative**: Conduct user interviews, field studies, or focus groups.
    *   **Quantitative**: Analyze existing analytics, heatmaps, and funnel data.
    *   **Outcome**: Create **User Personas** and **Empathy Maps** to represent core user groups.

3.  **User Journey Mapping**
    *   Map the "Current State" user journey to identify pain points.
    *   Create "Future State" user flows.
    *   Identify "Moments of Truth" where the design must excel.

## Phase 2: Ideate & Structure (Information Architecture)

4.  **Information Architecture (IA)**
    *   Organize content and navigation structure (Card Sorting, Tree Testing).
    *   Create site maps or app flow diagrams.
    *   Define taxonomy and labeling systems.

5.  **Wireframing (Low-Fidelity)**
    *   Sketch initial concepts on whiteboard/paper.
    *   Create low-fi wireframes (Figma/Balsamiq) focusing on layout and flow.
    *   **Review**: Conduct internal design critiques to iterate quickly.

## Phase 3: Prototype & Design (UI/Interaction)

6.  **Design System Management**
    *   Audit existing design tokens (colors, typography, spacing).
    *   Create/Update component library (Buttons, Inputs, Cards).
    *   Ensure accessibility compliance (WCAG 2.1 AA) for contrast and touch targets.
    *   *Documentation*: Update `ui_design_system.md` global artifact.

7.  **High-Fidelity Design**
    *   Apply visual styling to wireframes.
    *   Design responsive states (Desktop, Tablet, Mobile).
    *   Design interactive states (Hover, Focus, Active, Disabled, Loading).
    *   Create dark mode / light mode variants.

8.  **Prototyping**
    *   Connect screens to demonstrate flows.
    *   Define micro-interactions and transitions (Framer Motion/CSS).
    *   Create "Click-through" prototypes for user testing.

## Phase 4: Validate (Testing)

9.  **Usability Testing**
    *   Define tasks for users to complete (e.g., "Find the settings page and change your password").
    *   Conduct moderated or unmoderated sessions (UserTesting/Maze).
    *   Analzye results: Task completion rate, time on task, error rate.

10. **Heuristic Evaluation**
    *   Evaluate design against 10 Usability Heuristics (Nielsen/Norman).
    *   Check for consistency and standard patterns.

11. **Accessibility Audit**
    *   Test with screen readers (VoiceOver/NVDA).
    *   Verify keyboard navigation order.
    *   Check for color-blindness compatibility.

## Phase 5: Deliver & Handoff

12. **Engineering Handoff**
    *   Annotate designs with behavior specs (edge cases, max character limits).
    *   Export assets (SVG icons, optimized images).
    *   Provide CSS/Tailwind values for tokens.
    *   Walk through designs with developers to clarify intent.

13. **Design QA (Implementation Review)**
    *   Review the implemented code against the design files.
    *   File "Visual Bugs" for spacing, color, or alignment issues.
    *   Verify animations and responsiveness.

## Output Artifacts

| Artifact | Tool | Purpose |
|----------|------|---------|
| User Personas | FigJam/Miro | Align team on user needs |
| User Flows | FigJam/Mermaid | visualize steps |
| Wireframes | Figma | Structure and layout |
| High-Fi Mocks | Figma | Visual specs |
| Prototype | Figma | Interaction behavior |
| Design System | Storybook/Figma | Reusable components |

## Integration with Other Roles

### → Product Manager (`/product_manager`)
*   Review PRD and ensure design solves the core problem.
*   Negotiate scope vs. experience trade-offs.

### → Engineering
*   Assess feasibility of complex interactions.
*   Discuss component reusability.

## Best Practices
*   **Mobile-First**: Design for the smallest constraint first (if applicable).
*   **Content-First**: Use real data/copy in designs, avoid "Lorem Ipsum".
*   **State-Aware**: Always design Empty, Loading, and Error states.
*   **Consistency**: Adhere to the design system to reduce tech debt.

## Common Pitfalls
*   ❌ Designing for the "Happy Path" only (ignoring errors).
*   ❌ Inconsistent spacing or typography usage.
*   ❌ Relying on color alone to convey meaning (accessibility fail).
*   ❌ Handing off "pictures" without explaining "behavior".
