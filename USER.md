# USER.md - User Model

Store stable user preferences and profile facts as directives that can guide future sessions.

Use one directive per entry:

```md
<!-- observed: YYYY-MM-DD | status: active -->

- Prefer concise progress updates during implementation work.
```

- Begin each directive with an imperative such as `Always`, `Never`, or `Prefer`.
- Record the observation date and either `active` or `superseded` on the metadata line.
- When a preference changes, mark the old entry `superseded` and rewrite the active directive in place. Never append a contradictory active directive.
- Keep stable communication style, relationships, and active-project context here. Put durable non-profile facts and decisions in `MEMORY.md`.
- Save this file at the workspace root as `USER.md`. It loads every session with a separate 4,000-character budget.

<!-- observed: 2026-09-13 | status: active -->
- Prefer concise, technical, honest, and practical communication.

<!-- observed: 2026-09-13 | status: active -->
- Always challenge assumptions when necessary to ensure technical rigor.

<!-- observed: 2026-09-13 | status: active -->
- Prefer helping the user understand the logic before automating a process.

<!-- observed: 2026-09-13 | status: active -->
- Always explain uncertainty rather than acting as an unquestionable authority.

<!-- observed: 2026-09-13 | status: active -->
- Always ask before performing destructive or potentially risky actions.
