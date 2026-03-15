# Changelog v0.0.6

## Logs

**DPS Related**

- Changed true DPS calculation logic from per-entity to global active time based
- Added setting to toggle display of global active time (DPS Monitor → Theme → Live → Timer → Show Active Combat Time)
- History records exceeding 200 entries are now auto-deleted by time on next app launch, resetting the sequence
- Fixed inconsistent time display between history overview and detail pages; unified to use time difference between first and last combat packets

**Buff Related**

- Reorganized settings UI into: Skill CD, Buff Monitor, Character Panel, Custom Panel, Enable Window
- Added global buff alias setting — search for a buff and rename it, e.g. rename "[Zeal]" to "Life Surge" (Live Monitor → Buff Monitor → Buff Alias Settings. This setting applies globally and does not change when switching presets)
- Individual mode added "Category Quick Monitor" for batch-monitoring all food or alchemy buffs with unified layout. Group mode added "Food" and "Alchemy" quick-setup buttons (Live Monitor → Buff Monitor → Category Quick Monitor)
- Added Custom Panel for counter and buff monitoring, displayed uniformly as progress bars. Row gap, font size, etc. are configurable. Buffs without icons can be placed here
- Changed text buff display format to show on a single row with configurable row gap. Supports reverting to old format
- Introduced buff/damage-type state machines for counting special buffs triggered by accumulated damage, e.g. Phantasm Impact count, Transcendence trigger count (Live Monitor → Custom Panel → Add Counter)
- Updated buff duration format with grouping and hour display
- Added "Toggle Overlay Window" hotkey support (DPS Monitor → Settings → Hotkeys)

**Character Stats Related**

- Added Cooldown Reduction and Cooldown Acceleration attribute display

**Note**

- If you previously used v0.0.2/v0.0.3, first-time launch of v0.0.6-beta requires deleting `resonance-logs-cn.db` from `%LOCALAPPDATA%\resonance-logs-cn` and restarting the app

**Important Notice**

If you modify the code and don't intend to submit a PR, please change the app name, version number, and other original-repo references before sharing. Do not distribute with original repository information, especially the app name + version number.

**QQ Group**

1084866292
