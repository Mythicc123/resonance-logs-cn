# Phase 1: Fix Critical Bugs - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix the "DB thread non initialized" error and add schema migration guards to `src-tauri/src/database/mod.rs`. These are backend Rust changes only — no frontend changes needed.
</domain>

<decisions>
## Implementation Decisions

### D-01: DB Thread Initialization Order

**Decision:** Ensure `database::init()` is called and completes before `Builder::run()` registers Tauri commands. The current code already initializes DB during setup, but the issue is that `db_send()` silently swallows calls when `DB_SENDER.get() == None`. Add a startup barrier: the app should block startup until DB is confirmed initialized, or commands should return a clear error instead of silently failing.

**Approach:** In `lib.rs::run()`, after `database::init()` returns `Ok(())`, the DB thread is running. The `db_send()` function should be changed to return a `Result` instead of silently returning. Commands that call `db_send` should return errors to the frontend with clear messages.

**Specific changes:**
1. Change `db_send()` in `database/mod.rs` to return `Result<T, String>` instead of `()`
2. All command handlers using `db_send` must handle the `Err` case and return `Err()` to Tauri
3. Frontend shows error toast when DB commands fail with the error message

### D-02: Schema Migration Guards

**Decision:** Add defensive schema guards in `database/mod.rs::init()` after `conn.run_pending_migrations()`. These guards ensure that even if migrations fail or are skipped (e.g., user has old DB from before migrations were added), the schema is correct.

**Required guards (from fork analysis — these already exist in the fork):**
```rust
// Guard: encounter_data table
let _ = diesel::sql_query(
    "CREATE TABLE IF NOT EXISTS encounter_data (...)"
).execute(conn);

// Guard: boss_names column (from v0.0.6)
let _ = diesel::sql_query("ALTER TABLE encounters ADD COLUMN boss_names TEXT;").execute(conn);

// Guard: player_names column (from v0.0.6)
let _ = diesel::sql_query("ALTER TABLE encounters ADD COLUMN player_names TEXT;").execute(conn);

// Guard: active_combat_duration column (from 2026-03-07)
let _ = diesel::sql_query("ALTER TABLE encounters ADD COLUMN active_combat_duration REAL;").execute(conn);
```

These guards are idempotent — `CREATE TABLE IF NOT EXISTS` won't error, `ALTER TABLE ADD COLUMN` will fail silently if column exists (which we ignore with `let _`).

### D-03: NewEncounter Struct Verification

**Decision:** Verify `src-tauri/src/database/models.rs` has the full 12-field `NewEncounter` struct and that `save_encounter()` in `database/mod.rs` uses a single insert with all fields instead of insert-then-update.

**Fork already has:** `is_manually_reset: i32`, `boss_names: Option<String>`, `player_names: Option<String>` fields.

**Verify:** `save_encounter()` uses single insert with all fields, not the parent's two-step pattern.

### D-04: db_send Error Propagation

**Decision:** Change `db_send` from fire-and-forget to returning a `Result`. Commands that use it must propagate errors to the frontend.

```rust
// Old (silent failure):
pub fn db_send<F>(f: F) { ...; return; }

// New (explicit error):
pub fn db_send<F, R>(f: F) -> Result<R, String>
where F: FnOnce(&mut SqliteConnection) -> Result<R, diesel::result::Error>
```

This way, frontend commands get clear error messages like "DB not initialized" instead of silent failures.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Local Files
- `src-tauri/src/database/mod.rs` — DB initialization, thread, schema guards
- `src-tauri/src/database/commands.rs` — All DB commands that call db_send
- `src-tauri/src/database/models.rs` — NewEncounter struct definition
- `src-tauri/src/database/schema.rs` — Table definitions
- `src-tauri/src/lib.rs` — App initialization flow, DB init call site
- `src-tauri/src-tauri/Cargo.toml` — Tauri app metadata

### Parent Repo Files (via GitHub API)
- `fudiyangjin/resonance-logs-cn/src-tauri/src/database/mod.rs` — Reference for schema guards implementation
- `fudiyangjin/resonance-logs-cn/src-tauri/src/database/models.rs` — Reference for struct definition
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Patterns
- `diesel` ORM for SQLite — use `diesel::sql_query()` for raw SQL guards
- `OnceLock` + `mpsc::Sender<DbTask>` pattern for DB thread communication
- `tauri_specta` for TypeScript command bindings
- Migration files in `src-tauri/migrations/` directory

### Integration Points
- `database::init()` called in `lib.rs::run()` during app setup
- DB commands registered via `.commands(collect_commands![...])` in lib.rs
- Frontend uses `@tauri-apps/api` to call commands, gets Result<T, String>
- Schema guards run after `conn.run_pending_migrations()` in `init()`
</code_context>

<specifics>
## Specific Ideas

**"DB thread non initialized" error chain:**
1. User opens app → `lib.rs::run()` → `database::init()` spawns DB thread
2. User clicks "Encounter History" → `get_recent_encounters` command fires
3. `get_recent_encounters` calls `db_send()` → `DB_SENDER.get() == None` → silently returns
4. Frontend receives empty array → shows "DB thread non initialized"

**Why this happens:** The DB initialization might not complete before the first command fires, OR the DB thread panicked/crashed during init and `DB_SENDER` was never set.

**Fix chain:**
1. Make DB init block until confirmed running (use a barrier/acknowledgment)
2. Make `db_send` return errors instead of silent return
3. Add schema guards for backward compatibility
4. Verify NewEncounter struct completeness
</specifics>

<deferred>
## Deferred Ideas

- Monitor snapshot persistence (SYNC-02) — Phase 2
- Training dummy detection (SYNC-01) — Phase 2
- Version bump (REF-02) — Phase 3
- GitHub Issues enablement (REL-01) — Phase 4

</deferred>

---

*Phase: 01-fix-critical-bugs*
*Context gathered: 2026-03-26*
