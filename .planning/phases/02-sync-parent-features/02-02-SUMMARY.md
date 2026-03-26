---
phase: 02-sync-parent-features
plan: "02"
subsystem: tauri-backend
tags:
  - parent-sync
  - training-dummy
  - bootstrap-snapshot
  - tauri-commands
dependency_graph:
  requires:
    - 02-01
  provides:
    - live::commands::start_training_dummy
    - live::commands::stop_training_dummy
    - live::commands::save_and_apply_monitor_runtime_snapshot
    - bootstrap_snapshot wired in live_main.rs
  affects:
    - src-tauri/src/live/state.rs
    - src-tauri/src/live/commands.rs
    - src-tauri/src/live/live_main.rs
    - src-tauri/src/lib.rs
    - src-tauri/src/live/buff_monitor.rs
tech_stack:
  added: []
  patterns:
    - Tauri command handlers with specta type generation
    - State channel commands via LiveControlCommand enum
    - Bootstrap snapshot restoration on app startup
key_files:
  created: []
  modified:
    - src-tauri/src/live/state.rs
    - src-tauri/src/live/commands.rs
    - src-tauri/src/live/live_main.rs
    - src-tauri/src/lib.rs
    - src-tauri/src/live/buff_monitor.rs
decisions:
  - "Added enabled field to BossBuffMonitors struct in buff_monitor.rs to support
     snapshot restoration of monster monitor state"
  - "Used direct field access for snapshot application rather than new setter
     methods on EntityMonitor, since the struct fields are already public"
  - "Made set_enabled/set_global_ids/set_self_applied_ids pub on BossBuffMonitors
     (existing set_config was pub(crate))"
metrics:
  duration_minutes: 5
  completed_date: "2026-03-26"
---

# Phase 2 Plan 2 Summary: Wire Commands and Integration

Wired `training_dummy` and `bootstrap_snapshot` modules into the Tauri command surface and app startup path.

## One-liner

Tauri commands for training dummy and monitor runtime snapshot save/restore, with bootstrap snapshot loading on app startup.

## What Was Done

### Task 1: State Management Methods (state.rs + buff_monitor.rs)

Added to `LiveControlCommand` enum:
- `StartTrainingDummy(TrainingDummyMonsterId)`
- `StopTrainingDummy`
- `ApplyMonitorRuntimeSnapshot(MonitorRuntimeSnapshot)`

Added to `AppState` struct:
- `training_dummy: TrainingDummyRuntime` field initialized with `default()`

Added to `AppStateManager`:
- `start_training_dummy(monster_id)` - sends `StartTrainingDummy` command
- `stop_training_dummy()` - sends `StopTrainingDummy` command
- `apply_monitor_runtime_snapshot(snapshot)` - sends `ApplyMonitorRuntimeSnapshot` command
- `apply_monitor_runtime_snapshot_with_state(state, snapshot)` - applies snapshot directly to state (used at startup before the live loop)

Added to `BossBuffMonitors` in buff_monitor.rs:
- `enabled: bool` field
- `set_enabled(bool)` setter
- `set_global_ids(Vec<i32>)` setter (updates monitored_buff_ids + existing monitors)
- `set_self_applied_ids(Vec<i32>)` setter (updates self_applied_buff_ids + existing monitors)

### Task 2: Tauri Commands (commands.rs)

Three new commands registered with `#[tauri::command]` and `#[specta::specta]`:
- `start_training_dummy(monster_id: i32)` - converts to `TrainingDummyMonsterId`, calls `state_manager.start_training_dummy()`
- `stop_training_dummy()` - calls `state_manager.stop_training_dummy()`
- `save_and_apply_monitor_runtime_snapshot(snapshot, app_handle)` - normalizes snapshot, saves to disk, applies to state

### Task 3: Integration Wiring (live_main.rs + lib.rs)

**live_main.rs**: After `AppState::new()`, added bootstrap snapshot loading:
```rust
if let Some(snapshot) = crate::live::bootstrap_snapshot::load_monitor_runtime_snapshot(&app_handle) {
    state_manager.apply_monitor_runtime_snapshot_with_state(&mut state, snapshot);
}
```

**lib.rs**: Registered all three new commands in `collect_commands!` macro alongside existing `set_buff_counter_rules`.

**greedy_optimize_modules**: Already present at line 88 in lib.rs (from previous plan).

## Verification Results

```
grep -c "start_training_dummy" src-tauri/src/lib.rs   -> 1
grep -c "stop_training_dummy" src-tauri/src/lib.rs     -> 1
grep -c "save_and_apply_monitor_runtime_snapshot" lib.rs -> 1
grep -c "load_monitor_runtime_snapshot" live_main.rs  -> 1
grep -c "greedy_optimize_modules" lib.rs              -> 1
cargo check                                          -> SUCCESS (warnings only)
```

## Known Warnings

`training_dummy.rs` contains three `#[allow(dead_code)]`-gated functions (`resolve_target_monster_id`, `decode_attr_id`, `is_local_player_damage`) that are not yet called by the live meter loop. These are normal for a partially-integrated module.

## Commits

- `3e4c5ea` feat(parent-sync): wire commands and bootstrap snapshot integration

## Self-Check: PASSED

- `src-tauri/src/live/state.rs` - MODIFIED
- `src-tauri/src/live/commands.rs` - MODIFIED
- `src-tauri/src/live/live_main.rs` - MODIFIED
- `src-tauri/src/lib.rs` - MODIFIED
- `src-tauri/src/live/buff_monitor.rs` - MODIFIED
- Commit `3e4c5ea` found in git log
