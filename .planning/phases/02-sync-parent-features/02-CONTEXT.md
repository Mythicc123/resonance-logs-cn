# Phase 2: Sync Parent Features - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Port two modules from the parent repository (fudiyangjin/resonance-logs-cn) that are missing from this fork: `training_dummy.rs` and `bootstrap_snapshot.rs`. These add training dummy detection and monitor runtime snapshot persistence (settings saved/loaded between sessions). Wire up commands and integration points.
</domain>

<decisions>
## Implementation Decisions

### D-01: File Ports from Parent

**Decision:** Copy `training_dummy.rs` and `bootstrap_snapshot.rs` from the parent repository (fudiyangjin/resonance-logs-cn) into this fork's `src-tauri/src/live/` directory. These files exist in the parent but not in the fork.

**Files to port:**
- `src-tauri/src/live/training_dummy.rs` — Training dummy monster detection and tracking
- `src-tauri/src/live/bootstrap_snapshot.rs` — Monitor runtime snapshot save/load

### D-02: Module Registration

**Decision:** Add both modules to `src-tauri/src/live/mod.rs`. Based on the parent repo analysis, the modules are registered with `pub mod` declarations.

### D-03: Live Main Wiring

**Decision:** In `src-tauri/src/live/live_main.rs`, add the bootstrap snapshot loading call after `AppState::new()`. The parent code shows:
```rust
let mut state = AppState::new();
if let Some(snapshot) = crate::live::bootstrap_snapshot::load_monitor_runtime_snapshot(&app_handle) {
    state_manager.apply_monitor_runtime_snapshot_with_state(&mut state, snapshot);
}
```

This is the key integration point that restores monitor settings (buffs, skills, panel attrs, counter rules) between app restarts.

### D-04: Command Registration

**Decision:** Add the missing Tauri commands from the parent to `src-tauri/src/lib.rs`:
- `live::commands::start_training_dummy`
- `live::commands::stop_training_dummy`
- `live::commands::save_and_apply_monitor_runtime_snapshot`
- `module_optimizer::commands::greedy_optimize_modules`

Also remove any fork-only commands from lib.rs that the parent doesn't have (if any conflict).

### D-05: Cargo Dependencies

**Decision:** Check if `training_dummy.rs` or `bootstrap_snapshot.rs` require `anyhow` or `cmake` dependencies. The parent has these in `src-tauri/Cargo.toml`. Add them if needed by the new modules.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Parent Repo Files (via GitHub API)
- `fudiyangjin/resonance-logs-cn/src-tauri/src/live/training_dummy.rs` — Training dummy module (port this)
- `fudiyangjin/resonance-logs-cn/src-tauri/src/live/bootstrap_snapshot.rs` — Snapshot persistence (port this)
- `fudiyangjin/resonance-logs-cn/src-tauri/src/live/mod.rs` — Module registration
- `fudiyangjin/resonance-logs-cn/src-tauri/src/live/live_main.rs` — Bootstrap snapshot wiring
- `fudiyangjin/resonance-logs-cn/src-tauri/src/lib.rs` — Command registration

### Local Files (read for integration)
- `src-tauri/src/live/mod.rs` — Current module declarations
- `src-tauri/src/live/live_main.rs` — Current live initialization
- `src-tauri/src/lib.rs` — Current command registration
- `src-tauri/src-tauri/Cargo.toml` — Current Cargo.toml
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Patterns
- `pub mod training_dummy;` + `pub mod bootstrap_snapshot;` in `live/mod.rs`
- `crate::live::bootstrap_snapshot::load_monitor_runtime_snapshot(&app_handle)` pattern
- `AppStateManager` used throughout for state management
- `monitor_runtime_snapshot` type handles serialization

### Integration Points
- `live_main.rs` — where bootstrap snapshot loads after state creation
- `lib.rs` — where commands are registered with specta
- `live/mod.rs` — where modules are declared
</code_context>

<specifics>
## Specific Ideas

**Why this matters:** Without `bootstrap_snapshot.rs`, monitor settings (monitored skills, buffs, panel attrs, counter rules) are lost on every app restart. Users have to reconfigure everything after each launch. The parent saves these settings; the fork doesn't.

**Training dummy use case:** In training areas, certain monster IDs are training dummies. The `training_dummy.rs` module detects these and handles them specially (e.g., not counting toward boss rankings).
</specifics>

<deferred>
## Deferred Ideas

- Version bump (REF-02) — Phase 3
- GitHub Issues enablement (REL-01) — Phase 4

</deferred>

---

*Phase: 02-sync-parent-features*
*Context gathered: 2026-03-26*
