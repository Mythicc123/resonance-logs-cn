# Requirements: Resonance Logs CN — English Fork Fix & Sync

## v1 Requirements

### Bug Fixes

- [ ] **BUG-01**: Fix "DB thread non initialized" error in encounter history — ensure DB commands are only called after DB thread is fully initialized
- [ ] **BUG-02**: Fix schema migration guards — add defensive `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN` guards for backward compatibility with existing user databases
- [ ] **BUG-03**: Ensure `save_encounter()` uses correct `NewEncounter` struct with all 12 fields (including `is_manually_reset`, `boss_names`, `player_names`)

### Sync with Parent

- [ ] **SYNC-01**: Add missing `training_dummy.rs` module from parent (training dummy detection and tracking)
- [ ] **SYNC-02**: Add missing `bootstrap_snapshot.rs` module from parent (monitor runtime snapshot persistence — saves/loads monitor settings between sessions)
- [ ] **SYNC-03**: Add missing `live::commands::start_training_dummy` command
- [ ] **SYNC-04**: Add missing `live::commands::stop_training_dummy` command
- [ ] **SYNC-05**: Add missing `live::commands::save_and_apply_monitor_runtime_snapshot` command
- [ ] **SYNC-06**: Add missing `module_optimizer::commands::greedy_optimize_modules` command
- [ ] **SYNC-07**: Wire up `bootstrap_snapshot` in `live_main.rs` to restore monitor settings on startup
- [ ] **SYNC-08**: Add missing `anyhow` and `cmake` dependencies to `src-tauri/Cargo.toml` if needed by new modules

### Referencing & Quality

- [ ] **REF-01**: Ensure all app name references use "Resonance Logs EN" or similar (not original Chinese repo name)
- [ ] **REF-02**: Update version number to next release (0.0.14 or appropriate bump)
- [ ] **REF-03**: Verify all documentation references (README, CHANGELOG) point to correct repo
- [ ] **REF-04**: Verify `package.json` name is correct for the fork
- [ ] **REF-05**: Verify Tauri app metadata (app name, identifier) is correct for the fork

### Release & CI/CD

- [ ] **REL-01**: Enable GitHub Issues on the repository for user bug reports
- [ ] **REL-02**: Verify GitHub Actions release workflow builds and creates release correctly
- [ ] **REL-03**: Create release commit/tag with version bump
- [ ] **REL-04**: GitHub Actions auto-release triggers on version bump commit

## Out of Scope

- Adding features not in parent or fork
- Modifying game protocol/packet parsing
- Adding new UI components
- Multi-platform support (Windows only)
- GPU optimization module changes

---
*REQ-ID format: [CATEGORY]-[NUMBER]*
