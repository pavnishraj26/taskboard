# Jira → SpecKit agents

Automate feature development from a Jira user story using GitHub SpecKit phases.

## Invoke

```text
/jira-speckit-master PROJ-123
```

Or ask: “Implement Jira PROJ-123 with SpecKit.”

## Agents (sequential)

| Agent | Role |
|-------|------|
| `jira-speckit-master` | Orchestrates the pipeline; does not implement itself |
| `jira-story-reader` | Fetches Jira issue → feature brief |
| `speckit-specify` | Writes `specs/NNN-slug/spec.md` |
| `speckit-plan` | Writes plan, research, data-model, contracts, quickstart |
| `speckit-tasks` | Writes `tasks.md` |
| `speckit-implement` | Implements tasks test-first |
| `speckit-verify` | Runs quality gates / acceptance check |

## Prerequisites

- Atlassian MCP connected (Settings → Tools & MCP → Atlassian)
- Follow `.cursor/rules/` (summarized in `AGENTS.md`)

## Handoff tokens

Each sub-agent ends with one of: `READY_FOR_*`, `BLOCKED: …`, `DONE`, or `NEEDS_FIX: …`. The master advances only on the expected `READY_*` / `DONE` token.
