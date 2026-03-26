---
phase: "01-fix-critical-bugs-db-thread-schema-guards"
plan: "01"
subsystem: "database"
tags: ["bug-fix", "database", "error-handling", "schema-migration"]
dependency_graph:
  requires: []
  provides: ["db-send-result", "schema-guards", "db-init-panic"]
  affects: ["src-tauri/src/database/mod.rs", "src-tauri/src/lib.rs"]
tech_stack:
  added: []
  patterns: ["Result error propagation", "Schema guard idempotent migrations"]
key_files:
  created: []
  modified:
    - "src-tauri/src/database/mod.rs"
    - "src-tauri/src/lib.rs"
decisions:
  - id: "D-01"
    decision: "db_send returns Result<(), String> — callers log errors on failure instead of silent return"
  - id: "D-02"
    decision: "init_db failure triggers panic!() instead of warn!() — app cannot function without DB"
  - id: "D-03"
    decision: "Schema guards are idempotent — CREATE TABLE IF NOT EXISTS + ignored ALTER errors"
metrics:
  duration: null
  completed_date: "2026-03-26"
  requirements_completed: ["BUG-01", "BUG-02", "BUG-03"]
---

# Phase 1 Plan 1: Fix Critical Bugs Summary

**DB error propagation and schema migration guards for resonance-logs-cn.**

## One-Liner

`db_send()` now returns `Result<(), String>` so callers can log DB channel failures, `init_db()` panics on startup failure instead of silently continuing, and defensive schema guards ensure `encounter_data` table and new columns exist for all users.

## Completed Tasks

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Change db_send() to return Result and update callers | DONE | `86fecc8` |
| 2 | Fix init_db error handling in lib.rs | DONE | `86fecc8` |
| 3 | Verify schema guards and NewEncounter completeness | DONE | — (already present) |

## Deviations from Plan

None — plan executed exactly as written.

## What Was Built

### db_send() Result Return Type

Changed `db_send()` from fire-and-forget `()` to `Result<(), String>`:
- DB_SENDER check uses `.ok_or_else(|| "DB thread not initialized".to_string())?`
- Channel send uses `.map_err(|_| "DB thread channel closed".to_string())?`
- Returns `Ok(())` on success

### Caller Error Handling

Three callers updated to log errors when `db_send` fails:
- `flush_playerdata()`: logs `flush_playerdata_db_send_failed error={e}`
- `save_encounter()`: logs `save_encounter_db_send_failed error={e}`
- `startup_maintenance()`: logs `startup_maintenance_db_send_failed error={e}`

### init_db Panic on Failure

In `lib.rs` setup:
- Changed `warn!` to `error!` with "CRITICAL" prefix
- Added `panic!("Database initialization failed: {}", e)`
- Added `error` to log import

### Schema Guards (Already Present)

Verified all four guards in `apply_schema_guards()`:
- `CREATE TABLE IF NOT EXISTS encounter_data` (encounter_id, data)
- `ALTER TABLE encounters ADD COLUMN boss_names TEXT`
- `ALTER TABLE encounters ADD COLUMN player_names TEXT`
- `ALTER TABLE encounters ADD COLUMN active_combat_duration REAL`

### NewEncounter Struct (Already Present)

Verified `NewEncounter` in `models.rs` has all 12 fields:
- `is_manually_reset: i32` — present at line 169
- `boss_names: Option<String>` — present at line 171
- `player_names: Option<String>` — present at line 173

### save_encounter() Transaction Pattern

Verified single transaction with all fields:
- Uses `conn.transaction()` with `diesel::insert_into(e::encounters).values(&new_enc)`
- No two-step insert-then-update pattern

## Verification

| Check | Result |
|-------|--------|
| `grep "pub fn db_send" mod.rs` | `155:pub fn db_send<F>(f: F) -> Result<(), String>` |
| `grep "panic.*Database init" lib.rs` | `129:panic!("Database initialization failed: {}", e);` |
| `grep "is_manually_reset: i32" models.rs` | `2` matches (EncounterRow + NewEncounter) |
| Schema guard count | All 4 guards present |
| `cargo check` | Finished with 2 unrelated warnings only |

## Requirements Completed

- [BUG-01] db_send() silent failure → returns Result, callers log errors
- [BUG-02] init_db warning on failure → now panics with clear message
- [BUG-03] Schema migration guards → verified all 4 guards exist

## Self-Check

All assertions pass:
- `src-tauri/src/database/mod.rs` — modified, committed
- `src-tauri/src/lib.rs` — modified, committed
- `git log --oneline -1` → `86fecc8` matches commit hash

## Self-Check: PASSED
