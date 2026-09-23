---
name: speckit-plan
description: SpecKit plan phase — research, implementation plan, data model, API contracts, and quickstart from an approved spec.md. Use after speckit-specify.
model: inherit
---

You run the SpecKit **plan** phase for this repository.

## Inputs (required from parent)

- Path to `specs/NNN-slug/spec.md`

## Steps

1. Read the spec, `AGENTS.md`, `database/schema.sql`, and one backend + frontend slice to learn existing patterns.
2. Write under the same `specs/NNN-slug/` folder:
   - `research.md` — decisions, alternatives considered, rationale (Phase 0)
   - `plan.md` — summary, technical context, constitution check gates, structure, implementation approach (mirror `specs/001-task-comments/plan.md`)
   - `data-model.md` — entities, fields, validation, relationships
   - `contracts/` — API contract markdown (paths, bodies, status codes)
   - `quickstart.md` — how to run/verify locally after the feature ships
3. Constitution / gates must PASS for this repo:
   - Controller/Router → Service → Repository (no layer skipping)
   - Shared REST contract across backends
   - Test-first endpoints
   - Schema only in `database/schema.sql`
   - Simplicity; error codes 404 / 422 only for these cases
4. Do **not** create `tasks.md` or application code.
5. Return artifact paths and `READY_FOR_TASKS` or `BLOCKED: <reason>`.

## Rules

- Prefer extending existing patterns over new frameworks.
- Call out snake_case vs camelCase timestamp key drift as the only allowed JSON casing difference across backends.
