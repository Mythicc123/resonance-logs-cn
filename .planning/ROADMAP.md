# Roadmap: Resonance Logs CN — English Fork Fix & Sync

## Phase 1: Fix Critical Bugs (DB Thread & Schema Guards)
- [ ] Fix "DB thread non initialized" error — ensure DB initialization completes before any commands can fire, add defensive guards
- [ ] Add schema migration guards to `database/mod.rs` — defensive CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN for backward compat
- [ ] Verify `NewEncounter` struct has all 12 fields and `save_encounter()` uses them correctly

**Requirements:** BUG-01, BUG-02, BUG-03

**Plans:**
- [ ] 01-01-PLAN.md — Fix db_send to return Result, propagate errors, add panic on init failure, verify schema guards and NewEncounter

**Success criteria:**
1. App starts without "DB thread non initialized" errors
2. Users upgrading from old database versions don't get schema crashes
3. Encounter history loads correctly

## Phase 2: Sync Parent Features (Training Dummy & Snapshot Persistence)
- [ ] Add `training_dummy.rs` module from parent repo
- [ ] Add `bootstrap_snapshot.rs` module from parent repo
- [ ] Add `start_training_dummy`, `stop_training_dummy`, `save_and_apply_monitor_runtime_snapshot` commands
- [ ] Add `greedy_optimize_modules` command to module_optimizer
- [ ] Wire up `bootstrap_snapshot` in `live_main.rs` — restore monitor settings on startup
- [ ] Add any missing Cargo dependencies (`anyhow`, `cmake`)

**Requirements:** SYNC-01, SYNC-02, SYNC-03, SYNC-04, SYNC-05, SYNC-06, SYNC-07, SYNC-08

**Success criteria:**
1. Monitor settings persist between app restarts (skills, buffs, panel attrs, counter rules)
2. Training dummy encounters are detected and tracked separately
3. All commands from parent are present in fork

## Phase 3: Fix Referencing & Version Bump
- [ ] Audit all app name references — ensure "Resonance Logs EN" or appropriate fork branding
- [ ] Bump version to next release (0.0.14)
- [ ] Update CHANGELOG.md with release notes
- [ ] Verify README references correct repo (fork, not parent)
- [ ] Verify package.json name is correct
- [ ] Verify Tauri app identifier/name in Cargo.toml metadata

**Requirements:** REF-01, REF-02, REF-03, REF-04, REF-05

**Success criteria:**
1. No references to original Chinese repo name in UI
2. Version bumped correctly
3. CHANGELOG updated

## Phase 4: Release & GitHub Issues
- [ ] Enable GitHub Issues on the repository
- [ ] Verify GitHub Actions release workflow builds correctly
- [ ] Push release commit to trigger GitHub Actions release workflow
- [ ] Verify release artifact is created

**Requirements:** REL-01, REL-02, REL-03, REL-04

**Success criteria:**
1. GitHub Issues enabled for user bug reports
2. GitHub Actions release workflow succeeds
3. Release tag created and GitHub Release published

---
*Last updated: 2026-03-26*
