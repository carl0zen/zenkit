# Architectural Alignment

> Measures how well the implementation follows the planned architecture and project conventions.

## Scale
0-10, where 0 is a complete departure from the architecture and 10 is perfect alignment.

## Criteria

### Score 0-2: Divergent
The implementation ignores the architecture plan. Components are in the wrong layers, interfaces do not match contracts, and conventions are not followed. A redesign or major refactor is required to bring the work into alignment.

### Score 3-4: Misaligned
The implementation loosely follows the architecture but deviates in significant ways. Some component boundaries are violated, naming conventions are inconsistent, or data flows through unplanned paths. Multiple corrections are needed.

### Score 5-6: Partially Aligned
The implementation follows the architecture for major components but drifts on details. Most conventions are followed, but some shortcuts bypass the planned structure. Minor refactoring would bring it into full alignment.

### Score 7-8: Aligned
The implementation faithfully follows the architecture plan. Component boundaries are respected, interfaces match contracts, and project conventions are consistently applied. Minor deviations exist but are justified and documented.

### Score 9-10: Exemplary Alignment
The implementation is a textbook execution of the architecture plan. Every component, interface, and convention is followed precisely. Deviations, where they exist, improve on the original plan and are documented with rationale.

## How to Apply
Use this rubric during implementation-auditor review to assess structural compliance. Compare the implementation against the system-architect's design document, checking component boundaries, interface contracts, data flow paths, and naming conventions. Score each dimension separately and average for the final score. Minimum score to ship is configurable (default: 7).
