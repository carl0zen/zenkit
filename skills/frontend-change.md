# Frontend Change

> Implement frontend changes (components, pages, styles) following existing patterns and design system.

**When to use:**
- New UI component, page, or feature needs to be built
- Existing component requires visual or behavioral modification
- Accessibility or responsive layout improvements needed

**Input:** Description of the UI/UX change with visual references when available, affected components/pages, design system specs, and acceptance criteria including breakpoints and a11y requirements.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is the code changes -- components, styles, tests, and storybook entries where applicable.

**Watch for:**
- Hardcoding values instead of using design system tokens or theme variables
- Creating one-off components when a shared component could be extended
- Neglecting keyboard navigation, focus management, and cross-browser/viewport testing
