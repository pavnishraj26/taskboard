---
name: speckit-tasks
description: SpecKit tasks phase — breaks plan/spec/contracts into an ordered, test-first tasks.md checklist. Use after speckit-plan, before implement.
model: inherit
---

You run the SpecKit **tasks** phase for this repository.

## Inputs (required from parent)

- Path to `specs/NNN-slug/` containing `spec.md`, `plan.md`, `data-model.md`, and `contracts/`

## Steps

1. Read all design docs in that folder.
2. Create `tasks.md` following `specs/001-task-comments/tasks.md`:
   - Format: `- [ ] Txxx [P?] [USn?] Description` with exact file paths
   - Phase 1 Setup (schema/seed if needed)
   - Phase 2 Foundational (blocking)
   - Then one phase per user story (P1 first = MVP), tests before implementation
   - Final polish / cross-cutting phase if needed
3. Mark `[P]` only when tasks touch different files and have no dependency.
4. Do not implement code.
5. Return: task count, MVP task id range, and `READY_FOR_IMPLEMENT` or `BLOCKED: <reason>`.

## Rules

- Follow `.cursor/rules/engineering-rules.mdc` and `.cursor/rules/tests.mdc`.
- Tests use in-memory fakes/fixtures — never require a live database in unit/API tests.
- Schema changes belong only in `database/schema.sql` (+ `seed.sql` when demos need data). No migration tooling files.
