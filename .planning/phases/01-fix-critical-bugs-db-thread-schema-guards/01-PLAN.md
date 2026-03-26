---
phase: 01-fix-critical-bugs-db-thread-schema-guards
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src-tauri/src/database/mod.rs
  - src-tauri/src/lib.rs
autonomous: true
requirements:
  - BUG-01
  - BUG-02
  - BUG-03
must_haves:
  truths:
    - "db_send() returns errors instead of silently failing when DB thread is not initialized"
    - "App panics with clear error message if database fails to initialize"
    - "Schema guards exist for encounter_data table and boss_names/player_names/active_combat_duration columns"
    - "NewEncounter struct has all 12 fields including is_manually_reset, boss_names, player_names"
  artifacts:
    - path: "src-tauri/src/database/mod.rs"
      contains: "pub fn db_send<F>(f: F) -> Result<(), String>"
    - path: "src-tauri/src/database/mod.rs"
      contains: "apply_schema_guards"
    - path: "src-tauri/src/database/mod.rs"
      contains: "CREATE TABLE IF NOT EXISTS encounter_data"
    - path: "src-tauri/src/database/mod.rs"
      contains: "ALTER TABLE encounters ADD COLUMN boss_names"
    - path: "src-tauri/src/database/mod.rs"
      contains: "ALTER TABLE encounters ADD COLUMN player_names"
    - path: "src-tauri/src/database/mod.rs"
      contains: "ALTER TABLE encounters ADD COLUMN active_combat_duration"
    - path: "src-tauri/src/lib.rs"
      contains: 'panic!("Database initialization failed'
    - path: "src-tauri/src/database/models.rs"
      contains: "is_manually_reset: i32"
  key_links:
    - from: "src-tauri/src/database/mod.rs"
      to: "db_send"
      via: "Result return type"
      pattern: "db_send.*-> Result<(), String>"
    - from: "src-tauri/src/lib.rs"
      to: "database::init_db"
      via: "setup closure"
      pattern: "init_db.*panic"
---

<objective>
Fix the "DB thread non initialized" error by making DB errors propagate to the frontend instead of silently failing. Convert `db_send()` from a fire-and-forget void function to one that returns `Result<(), String>`, so callers can log failures. Also fix `init_db()` error handling in lib.rs so the app logs a fatal error instead of continuing with a broken DB.
</objective>

<context>
@src-tauri/src/database/mod.rs
@src-tauri/src/lib.rs
@src-tauri/src/database/models.rs
@src-tauri/src/database/schema.rs
</context>

<tasks>

<task type="auto">
  <name>Task 1: Change db_send() to return Result and update callers</name>
  <files>src-tauri/src/database/mod.rs</files>
  <read_first>
    src-tauri/src/database/mod.rs
  </read_first>
  <action>
Change `db_send()` (lines 155-167) from returning `()` to returning `Result<(), String>`. This allows callers to propagate or log errors instead of silent failures.

The current function:
```rust
pub fn db_send<F>(f: F)
where
    F: FnOnce(&mut SqliteConnection) + Send + 'static,
{
    let Some(sender) = DB_SENDER.get() else {
        log::error!(target: "app::db", "db_send_failed reason=not_initialized");
        return;
    };

    if sender.send(Box::new(f)).is_err() {
        log::error!(target: "app::db", "db_send_failed reason=channel_closed");
    }
}
```

Change to:
```rust
pub fn db_send<F>(f: F) -> Result<(), String>
where
    F: FnOnce(&mut SqliteConnection) + Send + 'static,
{
    let sender = DB_SENDER
        .get()
        .ok_or_else(|| "DB thread not initialized".to_string())?;

    sender
        .send(Box::new(f))
        .map_err(|_| "DB thread channel closed".to_string())?;

    Ok(())
}
```

Then update each caller in the same file to handle the Result:

1. `flush_playerdata()` (line 397): Wrap the inner `db_send` call in `if let Err(e) = db_send(...)` that logs an error. The diesel operations inside the closure already log warnings on failure. Keep the closure body unchanged but add outer error handling.

Current code (lines 397-421):
```rust
pub fn flush_playerdata(player_id: i64, last_seen_ms: i64, vdata_bytes: Vec<u8>) {
    db_send(move |conn| {
        use sch::detailed_playerdata::dsl as dp;

        let insert = m::NewDetailedPlayerData {
            player_id,
            last_seen_ms,
            vdata_bytes: Some(vdata_bytes.as_slice()),
        };
        let update = m::UpdateDetailedPlayerData {
            last_seen_ms,
            vdata_bytes: Some(vdata_bytes.as_slice()),
        };

        let result = diesel::insert_into(dp::detailed_playerdata)
            .values(&insert)
            .on_conflict(dp::player_id)
            .do_update()
            .set(&update)
            .execute(conn);
        if let Err(e) = result {
            log::warn!(target: "app::db", "flush_playerdata_failed error={}", e);
        }
    })
}
```

Change to:
```rust
pub fn flush_playerdata(player_id: i64, last_seen_ms: i64, vdata_bytes: Vec<u8>) {
    if let Err(e) = db_send(move |conn| {
        use sch::detailed_playerdata::dsl as dp;

        let insert = m::NewDetailedPlayerData {
            player_id,
            last_seen_ms,
            vdata_bytes: Some(vdata_bytes.as_slice()),
        };
        let update = m::UpdateDetailedPlayerData {
            last_seen_ms,
            vdata_bytes: Some(vdata_bytes.as_slice()),
        };

        let result = diesel::insert_into(dp::detailed_playerdata)
            .values(&insert)
            .on_conflict(dp::player_id)
            .do_update()
            .set(&update)
            .execute(conn);
        if let Err(e) = result {
            log::warn!(target: "app::db", "flush_playerdata_failed error={}", e);
        }
    }) {
        log::error!(target: "app::db", "flush_playerdata_db_send_failed error={}", e);
    }
}
```

2. `save_encounter()` (line 423): Wrap the `db_send` call at line 429 in `if let Err(e) = db_send(...)` that logs an error. The inner closure body (lines 430-503) is unchanged.

Current code at line 429:
```rust
    db_send(move |conn| {
```

Change to:
```rust
    if let Err(e) = db_send(move |conn| {
```

And after the closure body (after line 503, before the closing `}` of the function), add:
```rust
    } {
        log::error!(target: "app::db", "save_encounter_db_send_failed error={}", e);
    }
```

3. `startup_maintenance()` (lines 205-215): The existing code has `if let Err(error)` handling for the closure's inner result, but `db_send` returned `()` so the Err branch was unreachable. With the new return type, the outer error handling now works.

Current code (lines 205-215):
```rust
pub fn startup_maintenance() {
    db_send(|conn| {
        if let Err(error) = prune_and_reindex_encounters(conn, MAX_ENCOUNTER_HISTORY) {
            log::warn!(
                target: "app::db",
                "startup_maintenance_failed error={}",
                error
            );
        }
    });
}
```

Change to:
```rust
pub fn startup_maintenance() {
    if let Err(e) = db_send(|conn| {
        if let Err(error) = prune_and_reindex_encounters(conn, MAX_ENCOUNTER_HISTORY) {
            log::warn!(
                target: "app::db",
                "startup_maintenance_failed error={}",
                error
            );
        }
    }) {
        log::error!(target: "app::db", "startup_maintenance_db_send_failed error={}", e);
    }
}
```
  </action>
  <verify>
    <automated>grep -n "^pub fn db_send" src-tauri/src/database/mod.rs && grep -n "-> Result<(), String>" src-tauri/src/database/mod.rs && grep -n "db_send_db_send_failed\|flush_playerdata_db_send_failed\|save_encounter_db_send_failed\|startup_maintenance_db_send_failed" src-tauri/src/database/mod.rs</automated>
  </verify>
  <done>db_send returns Result<(), String>, flush_playerdata logs error on db_send failure, save_encounter logs error on db_send failure, startup_maintenance logs error on db_send failure</done>
  <acceptance_criteria>
    - `pub fn db_send` function signature includes `-> Result<(), String>` return type
    - `db_send` body uses `.ok_or_else(...)` for DB_SENDER check (not `let Some` with early return)
    - `db_send` body uses `.map_err(...)` for channel send (not `if sender.send(...).is_err()`)
    - `flush_playerdata` wraps `db_send` call in `if let Err(e) = db_send(...)` with `log::error!(target: "app::db", "flush_playerdata_db_send_failed`
    - `save_encounter` wraps `db_send` call in `if let Err(e) = db_send(...)` with `log::error!(target: "app::db", "save_encounter_db_send_failed`
    - `startup_maintenance` wraps `db_send` call in `if let Err(e) = db_send(...)` with `log::error!(target: "app::db", "startup_maintenance_db_send_failed`
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Fix init_db error handling in lib.rs</name>
  <files>src-tauri/src/lib.rs</files>
  <read_first>
    src-tauri/src/lib.rs
  </read_first>
  <action>
Change the `init_db()` error handling in `lib.rs` (lines 127-129) from logging a warning and continuing, to logging a fatal error and panicking. The app cannot function without a working database.

Current code (lines 7 and 127-130):
```rust
use log::{info, warn};
// ...
if let Err(e) = crate::database::init_db() {
    warn!(target: "app::db", "Failed to initialize database: {}", e);
}
crate::database::startup_maintenance();
```

Change 1 — Update the import (line 7):
```rust
use log::{error, info, warn};
```

Change 2 — Update the init_db error handling (lines 127-130):
```rust
if let Err(e) = crate::database::init_db() {
    error!(target: "app::db", "CRITICAL: Failed to initialize database: {}. App cannot function without DB. Exiting.", e);
    panic!("Database initialization failed: {}", e);
}
crate::database::startup_maintenance();
```
  </action>
  <verify>
    <automated>grep -n 'panic!("Database initialization failed' src-tauri/src/lib.rs && grep -n "use log::" src-tauri/src/lib.rs | head -1</automated>
  </verify>
  <done>App exits with panic message if database initialization fails, rather than silently continuing with broken DB</done>
  <acceptance_criteria>
    - `init_db` failure triggers `panic!("Database initialization failed: ...")` with the error message
    - `use log::{error, info, warn};` import includes `error` macro
    - Log message uses `error!` (not `warn!`) with target `"app::db"` and contains "CRITICAL"
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Verify existing schema guards and NewEncounter completeness</name>
  <files>src-tauri/src/database/mod.rs, src-tauri/src/database/models.rs</files>
  <read_first>
    src-tauri/src/database/mod.rs
    src-tauri/src/database/models.rs
    src-tauri/src/database/schema.rs
  </read_first>
  <action>
Read and verify the following existing implementations. Based on the fork analysis, these should already be in place. No changes needed if all verifications pass.

1. Verify `apply_schema_guards()` function in `src-tauri/src/database/mod.rs` (around line 94) contains all four guards:
   - `CREATE TABLE IF NOT EXISTS encounter_data` with columns `encounter_id INTEGER PRIMARY KEY NOT NULL, data BLOB NOT NULL`
   - `ALTER TABLE encounters ADD COLUMN boss_names TEXT`
   - `ALTER TABLE encounters ADD COLUMN player_names TEXT`
   - `ALTER TABLE encounters ADD COLUMN active_combat_duration REAL`

2. Verify `NewEncounter` struct in `src-tauri/src/database/models.rs` (around line 149) has all 12 fields including:
   - `is_manually_reset: i32`
   - `boss_names: Option<String>`
   - `player_names: Option<String>`

3. Verify `save_encounter()` in `src-tauri/src/database/mod.rs` uses a single transaction with `diesel::insert_into(e::encounters).values(&new_enc)` (not a two-step pattern).

If any of these are missing, add them. If all exist, document verification in the summary.
  </action>
  <verify>
    <automated>grep -c "CREATE TABLE IF NOT EXISTS encounter_data" src-tauri/src/database/mod.rs && grep -c "ALTER TABLE encounters ADD COLUMN boss_names" src-tauri/src/database/mod.rs && grep -c "ALTER TABLE encounters ADD COLUMN player_names" src-tauri/src/database/mod.rs && grep -c "ALTER TABLE encounters ADD COLUMN active_combat_duration" src-tauri/src/database/mod.rs && grep -c "is_manually_reset: i32" src-tauri/src/database/models.rs</automated>
  </verify>
  <done>Schema guards cover all required tables/columns, NewEncounter has all 12 fields, save_encounter uses single transaction insert</done>
  <acceptance_criteria>
    - `apply_schema_guards` function contains `CREATE TABLE IF NOT EXISTS encounter_data`
    - `apply_schema_guards` function contains `ALTER TABLE encounters ADD COLUMN boss_names`
    - `apply_schema_guards` function contains `ALTER TABLE encounters ADD COLUMN player_names`
    - `apply_schema_guards` function contains `ALTER TABLE encounters ADD COLUMN active_combat_duration`
    - `NewEncounter` struct has `is_manually_reset: i32` field
    - `NewEncounter` struct has `boss_names: Option<String>` field
    - `NewEncounter` struct has `player_names: Option<String>` field
    - `save_encounter` uses `conn.transaction` with single `diesel::insert_into(e::encounters).values(&new_enc)`
  </acceptance_criteria>
</task>

</tasks>

<verification>
- Build: `cd src-tauri && cargo build --lib 2>&1 | tail -20`
- Type check: `cd src-tauri && cargo check 2>&1 | tail -20`
- All grep-based acceptance criteria pass
</verification>

<success_criteria>
1. `db_send()` returns `Result<(), String>` and propagates errors instead of silent returns
2. `flush_playerdata()`, `save_encounter()`, and `startup_maintenance()` all log errors when `db_send` fails
3. App panics on database initialization failure (cannot run with broken DB)
4. Schema guards cover `encounter_data` table, `boss_names`, `player_names`, `active_combat_duration` columns
5. `NewEncounter` struct has all 12 required fields
6. `save_encounter()` uses single transaction insert with all fields
</success_criteria>

<output>
After completion, create `.planning/phases/01-fix-critical-bugs-db-thread-schema-guards/01-01-SUMMARY.md`
</output>
