# Project: Resonance Logs CN — English Fork Fix & Sync

## Overview

Fix the "DB thread non initialized" error in the encounter history, apply all upstream changes from the parent repository (fudiyangjin/resonance-logs-cn), fix all referencing problems, and release a new version. Also enable GitHub Issues for user bug reports.

## Core Goal

A fully working, up-to-date English translation fork with zero blocking bugs and user-issue posting enabled.

## Context

**Fork:** Mythicc123/resonance-logs-cn (English translation of Blue Protocol DPS meter)
**Parent:** fudiyangjin/resonance-logs-cn (original Chinese version)
**Fork version:** 0.0.13 | **Parent version:** 0.0.8 (parent has not released past 0.0.8)

The fork is 5 versions ahead of the parent. This means all new features (buff monitoring, panel attrs, counter rules, schema guards) were added by the fork author, NOT by the parent. The parent has features the fork is missing (training dummy, monitor snapshot persistence).

## Known Issues

### Critical: "DB thread non initialized" Error
The encounter history shows "DB thread non initialized" — this happens when a Tauri command calls the database before the DB thread is fully initialized, or when the DB sender channel hasn't been set.

**Root cause chain identified:**
1. `db_send()` silently returns on `DB_SENDER.get() == None`, so commands never fail — they just don't do anything
2. The `set_monitored_skills`, `set_monitored_buffs`, etc. commands use `AppStateManager` directly (not `db_send`), so they can't cause this
3. The issue is likely in `get_recent_encounters` or similar DB commands being called before `database::init()` completes in `lib.rs::run()`
4. **Schema migration guards missing** — users upgrading from old versions with incomplete migration history will get crashes

### Features Missing from Parent (Fork-Authored)
1. **Schema migration guards** (`apply_schema_guards()`) — critical backward-compat fix preventing crashes on schema changes
2. **`NewEncounter` struct** — missing 3 fields (`is_manually_reset`, `boss_names`, `player_names`) in parent
3. **`save_encounter()` pattern** — parent uses insert-then-update, fork uses single insert
4. **Training dummy detection** (`training_dummy.rs`) — exists in parent, not in fork
5. **Monitor runtime snapshot persistence** (`bootstrap_snapshot.rs`) — exists in parent, not in fork. Fork loses monitor settings between sessions.

### Features Added by Fork (Not in Parent)
1. Event update rate control (`set_event_update_rate_ms`)
2. Skill monitoring (`set_monitored_skills`)
3. Buff monitoring (`set_monitored_buffs`)
4. Boss monitored buffs (`set_boss_monitored_buffs`)
5. Panel attrs monitoring (`set_monitored_panel_attrs`)
6. Buff counter rules (`set_buff_counter_rules`)
7. Schema guards for backward compatibility
8. Full `NewEncounter` struct with all fields

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Framework: Tauri 2 + Svelte | Existing stack, don't change |
| Auth: OIDC to IAM Role | No long-lived credentials |
| Auto-release via GitHub Actions | CI/CD pipeline already exists |
| GitHub Issues for users | Requested by user |

## Out of Scope

- Adding new features not in parent or fork
- Modifying game packet parsing
- Platform support changes (Windows only)
- GPU module optimization changes

---
*Last updated: 2026-03-26 after fork-vs-parent analysis*
