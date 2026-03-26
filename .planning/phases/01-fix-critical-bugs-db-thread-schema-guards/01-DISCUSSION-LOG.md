# Phase 1: Fix Critical Bugs - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 01-fix-critical-bugs
**Mode:** Auto (--auto)

---

## Mode: Auto

No interactive discussion occurred. This was an auto-mode session based on fork-vs-parent analysis.

### Auto Decisions Made

**D-01 — DB thread initialization:** `[auto]` Selected: Make `db_send()` return `Result<T, String>` and propagate errors to frontend.
Reason: The current fire-and-forget pattern causes silent failures. Changing to explicit error propagation ensures commands fail visibly instead of silently.

**D-02 — Schema migration guards:** `[auto]` Selected: Add defensive guards after migrations in `database/mod.rs`.
Reason: Fork already has these guards but parent doesn't. They prevent crashes when users upgrade from old DB versions.

**D-03 — NewEncounter struct:** `[auto]` Selected: Verify fork already has full 12-field struct, no changes needed.
Reason: Fork analysis confirmed the struct is complete.

**D-04 — db_send error propagation:** `[auto]` Selected: Change `db_send` return type from `()` to `Result<T, String>`.
Reason: Commands need to return errors to frontend so users see what went wrong instead of silent failures.

## Deferred Ideas

- Monitor snapshot persistence (SYNC-02) — Phase 2
- Training dummy detection (SYNC-01) — Phase 2
- Version bump (REF-02) — Phase 3
- GitHub Issues enablement (REL-01) — Phase 4
