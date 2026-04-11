# Frontend Change

> Implement frontend changes (components, pages, styles) following existing patterns and design system.

## Capability
Make targeted changes to client-side code -- creating or modifying components, pages, layouts, and styles. Changes adhere to the project's design system, component library conventions, and state management patterns. Includes writing or updating tests and verifying visual correctness.

## Trigger Conditions
- A new UI component, page, or feature needs to be built.
- An existing component requires visual or behavioral modification.
- Styling or layout issues need to be corrected.
- State management or data-fetching logic on the client needs to change.
- Accessibility improvements are required.

## Input
- Description of the desired UI/UX change with visual references (mockups, screenshots, Figma links) when available.
- Relevant codebase context (affected components, pages, shared utilities).
- Design system tokens or component API specs if applicable.
- Acceptance criteria including responsive breakpoints and accessibility requirements.

## Output
- **context**: Summary of what was changed and why.
- **assumptions**: Assumptions about browser support, design system usage, and data availability.
- **constraints**: Limits respected during implementation (design system boundaries, bundle size budgets, accessibility standards).
- **decision**: Key implementation choices (component composition, state strategy, styling approach) and rationale.
- **deliverable**: The code changes -- new/modified components, styles, tests, and storybook entries where applicable.
- **risks**: Potential issues (cross-browser rendering, performance on low-end devices, accessibility regressions).
- **open_questions**: Design or product decisions that remain unresolved.
- **next_agent**: Suggested follow-up skill (e.g., `security-review`, `release-check`).

## Quality Criteria
- Components follow the existing design system and project conventions.
- Changes are responsive across specified breakpoints.
- Accessibility standards (WCAG 2.1 AA minimum) are met -- proper semantics, keyboard navigation, screen reader support.
- No unnecessary re-renders or performance regressions introduced.
- Visual output matches the provided design reference.

## Common Pitfalls
- Hardcoding values instead of using design system tokens or theme variables.
- Creating one-off components when an existing shared component could be extended.
- Neglecting keyboard navigation and focus management.
- Testing only in one browser or viewport size.
- Adding client-side state when server-derived state or URL state would be simpler.
