# Feature Specification: Kanban Board UI

**Feature Branch**: `002-kanban-board-ui`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Refresh the task board so it reads as a real Kanban board — always-visible To Do / In Progress / Done columns, clearer cards, a collapsible new-task panel, one design language, and OS dark mode — without changing what the app does." Source brief: `docs/feature-ui-refresh.md`. No Jira key.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See where work sits (Priority: P1)

An engineer opening the board wants three status columns in front of them at once: To Do, In Progress, and Done. On a desktop-width window the columns sit side by side. On a narrow window they stack, still clearly separated, in that same order. Each column heading shows its name and a live count of the cards in it. Each heading has its own accent so the eye can land on the right column. The status filter still works: choosing one status shows only that column; choosing all shows all three.

**Why this priority**: Seeing pile-up by status is the reason for the refresh. Cards, form, and theme polish sit on top of a board that is already readable as Kanban.

**Independent Test**: Load a board that has tasks in more than one status. At a wide viewport, confirm three side-by-side columns with labels and counts. Narrow the viewport and confirm the same columns stack without merging. Apply the status filter and confirm only the matching column remains, with its count still correct.

**Acceptance Scenarios**:

1. **Given** tasks in To Do, In Progress, and Done, **When** the engineer views the board at desktop width (about 900px or wider), **Then** the three columns appear side by side, each headed by its label and a count equal to the cards in that column.
2. **Given** the same board, **When** the viewport is narrower than desktop width, **Then** the columns stack in To Do, In Progress, Done order and remain visually separate.
3. **Given** all three columns are visible, **When** the engineer filters to one status, **Then** only that column is shown and its count matches the cards in it.
4. **Given** a column accent, **When** the heading is shown in light or dark mode, **Then** the accent is distinct per column and text on it meets WCAG AA contrast.

---

### User Story 2 - Read a card at a glance (Priority: P2)

An engineer scanning a column wants each card to look the same: a clear title, the assignee as a small initials chip (no photo), and a muted line for when the task was created. Move and Delete are not a wall of buttons; they stay quiet until the card is hovered or focused. Delete looks secondary to Move. Comment count and the inline thread still work as they do today.

**Why this priority**: Once columns exist, card scanability is what makes the board usable. It does not change create, move, or delete.

**Independent Test**: Open a card with an assignee and a created time. Confirm the initials chip, the relative time line, and that Move and Delete are visually quiet until hover or keyboard focus, with Delete secondary to Move. Confirm a card with no assignee does not invent initials.

**Acceptance Scenarios**:

1. **Given** a task assigned to "Ana Ruiz", **When** the card renders, **Then** the assignee appears as an initials chip "AR" and not as a photograph.
2. **Given** a task with no assignee, **When** the card renders, **Then** the card shows an unassigned treatment and no initials chip.
3. **Given** a task created 3 days ago, **When** the card renders, **Then** a muted line reads as a relative created time (see Assumptions for phrasing).
4. **Given** a card that is not hovered or focused, **When** the engineer looks at it, **Then** Move and Delete are visually quiet; **When** they hover or focus the card, **Then** the actions become apparent and Delete is visually secondary to Move.
5. **Given** a task with comments, **When** the engineer uses the comment control, **Then** the count, thread, post, and delete behaviours from the task-comments feature are unchanged.

---

### User Story 3 - Keep the board primary (Priority: P3)

The new-task form is useful but should not dominate the page. It lives in a panel the engineer can collapse and expand. The board columns are the main content. The page header shows the product name, a one-line context, and the refresh control grouped with the header rather than stranded in the toolbar.

**Why this priority**: Layout hierarchy matters after the columns and cards are readable. Creating a task must remain possible; it just stops owning the page.

**Independent Test**: Load the board, collapse the new-task panel, and confirm the columns remain usable and the form is hidden. Expand it again and create a task; the new card appears in To Do and the form can be collapsed once more.

**Acceptance Scenarios**:

1. **Given** the board is open, **When** the engineer collapses the new-task panel, **Then** the form is hidden and the columns remain the primary content.
2. **Given** the panel is collapsed, **When** the engineer expands it and submits a valid task, **Then** the task is created as today and appears on the board.
3. **Given** the page header, **When** the engineer looks for refresh, **Then** the product name, one-line context, and refresh control are grouped in the header.

---

### User Story 4 - One look, including dark mode (Priority: P4)

The board uses one type scale, one spacing scale, and a small palette, defined once and reused. When the operating system is set to dark mode, the board is fully usable with the same AA contrast. Loading shows an intentional skeleton or spinner instead of a bare "Loading…" line. Each empty column says there are no tasks yet. A new card eases in; moving a card does not make the columns jump. If the engineer prefers reduced motion, those animations do not run.

**Why this priority**: Visual consistency and states finish the refresh. The board already functions without them.

**Independent Test**: Toggle the OS color scheme and confirm the board stays readable. Empty a column and confirm its empty message. Create a task with motion allowed and with reduced motion, and confirm the card appears in both cases with animation only when motion is allowed.

**Acceptance Scenarios**:

1. **Given** the OS color scheme is dark, **When** the engineer views the board, **Then** surfaces, text, accents, and actions remain usable and meet WCAG AA contrast.
2. **Given** tasks are loading, **When** the board has not yet received them, **Then** a skeleton or spinner is shown rather than an unstyled text-only wait.
3. **Given** a column has no cards, **When** the engineer views it, **Then** that column shows a friendly empty message. A board with no tasks shows that message in each column, not a separate full-page empty screen.
4. **Given** motion is allowed, **When** a card is added, **Then** it enters with a short fade or slide and the columns do not jump in height when a card changes status.
5. **Given** the OS prefers reduced motion, **When** a card is added or moved, **Then** no animation runs and the card still appears in the correct column.

---

### Edge Cases

- A column count stays equal to the cards currently rendered in it after create, move, delete, refresh, and filter changes.
- Filtering to a status hides the other columns; clearing the filter shows all three again with correct counts.
- A task with a one-word assignee shows a single initial. Extra spaces in a name do not create empty initials.
- A task with no created time omits the relative-time line rather than showing a bogus date.
- Very long titles wrap inside the card and do not widen the column.
- Comment threads inside a card still scroll within the card and do not break the column.
- Keyboard users can reach Move, Delete, the comment control, the form panel toggle, filter, and refresh. Focus is visible.
- Colour is not the only way to tell columns apart: each column still has its text label.
- Resize across the desktop breakpoint reflows columns without dropping cards or changing their status.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The board MUST show the three statuses To Do, In Progress, and Done as separate columns.
- **FR-002**: At desktop width (about 900px and wider) the columns MUST sit side by side. Below that width they MUST stack in To Do, In Progress, Done order and stay visually separate.
- **FR-003**: Each visible column MUST show its label and a count of the cards in that column. The count MUST update when cards are created, moved, deleted, refreshed, or filtered.
- **FR-004**: Each column header MUST use a distinct accent. Text on that header MUST meet WCAG AA contrast in light and dark mode. Status MUST also be conveyed by the text label, not by colour alone.
- **FR-005**: The existing status filter MUST remain. "All" shows every column; one status shows only that column.
- **FR-006**: A card MUST show its title as the primary text. Description, when present, stays secondary.
- **FR-007**: When a task has an assignee, the card MUST show an initials chip derived from the name. The system MUST NOT load profile photos or a user directory.
- **FR-008**: When a task has no assignee, the card MUST show an unassigned treatment and MUST NOT show an initials chip.
- **FR-009**: When a task has a created time, the card MUST show a muted relative-time line using the phrasing in Assumptions.
- **FR-010**: Move and Delete MUST remain available. They MUST be visually quiet until the card is hovered or focused. Delete MUST be visually secondary to Move.
- **FR-011**: Comment count, expand/collapse, post, and delete MUST behave as specified for task comments. This feature MUST NOT change those behaviours.
- **FR-012**: The new-task form MUST live in a panel the engineer can collapse and expand. While collapsed, the form MUST be hidden and the columns MUST remain usable.
- **FR-013**: The header MUST group the product name, a one-line context, and the refresh control.
- **FR-014**: Type scale, spacing scale, palette, radius, and shadow MUST be defined once as shared design tokens and reused. Components MUST NOT introduce one-off colours outside those tokens.
- **FR-015**: When the OS preference is dark (`prefers-color-scheme: dark`), the board MUST remain fully usable at WCAG AA contrast. There MUST NOT be a separate theme-switcher control.
- **FR-016**: While tasks are loading, the board MUST show a skeleton or spinner.
- **FR-017**: An empty column MUST show a friendly empty message. A board with zero tasks MUST show that message in each visible column.
- **FR-018**: Adding a card MUST use a short enter motion, and a status change MUST NOT cause a layout jump, unless the OS prefers reduced motion, in which case motion MUST NOT run.
- **FR-019**: This feature MUST NOT add or change API endpoints, request or response fields, or the database schema. Task create, update, delete, filter, and comment flows MUST keep their current results.
- **FR-020**: Existing frontend tests MUST pass. Visible text and test hooks they rely on MUST stay stable, or those tests MUST be updated in the same change.
- **FR-021**: Focus-visible states, semantic headings, and keyboard access MUST NOT regress.

### Key Entities

- **Task**: Unchanged work item. Presentation uses title, description, assignee, status, and created time. No new stored fields.
- **Column**: A view of tasks that share one status (To Do, In Progress, or Done). It has a label, an accent, and a count. It is not a stored object and cannot be renamed or reordered.
- **Assignee chip**: A display of initials taken from the assignee name. It is not an account, avatar image, or directory record.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a desktop-width window, an engineer can tell how many tasks are in each status without scrolling horizontally and without opening a filter, in a single glance (three labeled counts visible at once).
- **SC-002**: For every visible column, the displayed count equals the number of cards rendered in it after create, move, delete, refresh, and filter, in 100% of those actions.
- **SC-003**: In both light and dark OS schemes, column header text and card body text meet WCAG AA contrast.
- **SC-004**: With reduced motion preferred, 100% of card enter and move animations are absent while the card still lands in the correct column.
- **SC-005**: Existing frontend component tests pass after the refresh.
- **SC-006**: An engineer can still create, move, delete, filter, refresh, and comment on a task with the same outcomes as before the refresh.

## Assumptions

- Desktop width means a viewport of about 900px or wider. Below that, columns stack. No separate mobile app layout.
- The status filter stays, because this feature does not change behaviour. Counts are shown on each column header only; there is no extra board-wide total.
- The new-task panel starts expanded so creating the first task stays obvious. Remembering collapsed state between visits is not part of this version.
- Initials: first letter of the first word and first letter of the last word, uppercased. A single word uses its first letter. Leading and trailing space is ignored.
- Created time phrasing: under a minute, "just now"; under a day, minutes or hours ago; from 1 day through 30 days, "N days ago"; older than 30 days, a short calendar date. Missing created time omits the line.
- Empty-column copy is "No tasks yet" in every empty column, including when all columns are empty.
- Enter motion is a short fade or slide (well under half a second) and is disabled under `prefers-reduced-motion`.
- "No behaviour change" includes the three interchangeable backends: the UI does not depend on which one is running, and it still accepts both `commentCount` and `comment_count`.
- Design-token names and exact values are chosen during planning, inside the constraints in FR-014 and FR-015. This spec does not lock hex codes.
- Styles stay in the existing global stylesheet. No CSS framework and no new component library.
- Component boundaries stay: presentational components, page-owned state and fetching, HTTP only in services.

## Out of Scope

- Drag-and-drop between columns. Move stays a button.
- New task fields, API changes, or schema changes.
- A user-facing theme switcher. Dark mode follows the OS only.
- Real avatars, profile pictures, or a user directory.
- Adding, renaming, or reordering columns.
- A separate mobile layout or mobile-app gestures beyond stacking the columns.
- Changing comment behaviour specified for task comments.
- Remembering the new-task panel's collapsed state between visits.

## Open Questions

- Exact type steps, spacing steps, palette, radius, and shadow values are not fixed here. Planning must pick one set of tokens that satisfies AA contrast in light and dark mode.
- Exact motion duration and easing are not fixed here, beyond "short" and "disabled when reduced motion is preferred."
