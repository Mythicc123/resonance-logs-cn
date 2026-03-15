# Frequently Asked Questions (FAQ)

## Installation & Running

### How do I save settings? Will my settings be lost after an upgrade?

When installing a new version, **do not delete the user settings directory** and your settings will be preserved. If the frontend has no structural changes in the current update, settings will be automatically compatible and saved.

### First-time upgrade to 0.0.6-beta prompts to clean the database?

If you previously used version 0.0.2 or 0.0.3, you need to manually clean the old database when upgrading to 0.0.6-beta for the first time, otherwise errors may occur:

1. Close the application
2. Delete `resonance-logs-cn.db` from the `%LOCALAPPDATA%\resonance-logs-cn` directory
3. Restart the application

---

## Data Capture

### Should I choose WinDivert or Npcap for packet capture?

| Method | Description |
|--------|-------------|
| **WinDivert** | Default method; requires administrator privileges; driver is bundled with the app |
| **Npcap** | Requires a separate installation of [Npcap](https://npcap.com/) |

Settings path: **DPS Meter > Settings > Network**.

### No data / packets not being captured?

1. Confirm the game is running
2. Check the capture method: WinDivert
3. If using Npcap: confirm Npcap is installed and the correct network interface is selected
4. Close any potentially conflicting VPNs, proxies, or other packet capture tools and try again

### WinDivert blocked by Windows Firewall?

If Windows Firewall blocks WinDivert, packet capture will not work properly. You can add a firewall exception rule for the application, or temporarily disable the firewall to troubleshoot.

![WinDivert firewall block illustration](features/img/faq/faq.png)

---

## DPS Related

### What is the difference between DPS and True DPS?

- **DPS**: Total damage / total combat duration
- **True DPS (TDPS)**: Total damage / total **active combat time** (excluding idle periods such as running between pulls, downtime, etc.)

### Is history automatically cleaned up?

When history exceeds 200 entries, the next time the application starts it will automatically delete older entries by time and reset the sequence.

---

## Buff / Skill CD

### Opened the app mid-game and CD/stats are incomplete?

If you launch the app while the game is already in progress, Skill CD, buff, and character panel stats may be incomplete. The game only sends **incremental updates**, so the app cannot retrieve the full current state. Solution: **change zones** once (e.g., enter/exit a dungeon, switch areas, teleport, etc.) to trigger a full state sync, and the display will return to normal.

### What are buff aliases for?

Some in-game buff names are not intuitive (e.g., `[Zeal]`). You can rename them in **Real-time Monitor > Buff Monitor > Buff Alias Settings** to a more recognizable name (e.g., "Life Fluctuation"). This setting applies globally and is not affected by preset switching.

### How do I quickly monitor all food / alchemy buffs?

- **Standalone mode**: Use "Category Quick Monitor" to monitor all food or alchemy buffs at once
- **Group mode**: In Buff Monitor, click the "Food" or "Alchemy" shortcut buttons for one-click configuration

### Not sure of the buff name -- how do I find what to monitor?

Since buff configuration names can be confusing, you can first enable "Monitor All" -- the overlay will display all buffs. Once you identify the correct name based on the actual effect, add it to the precise monitoring list.

---

## Other

### Where can I find the log files?

In **DPS Meter > Settings > Debug**, you can "Open Logs" directory.

### How do I share my configuration with someone else?

User configurations are stored in the `%APPDATA%\com.resonance-logs-cn` directory. Package that directory and send it to the other person; they can extract it to the same path to use your configuration (the application must be closed during this process).

### How do I toggle the overlay window?

In **DPS Meter > Settings > Hotkeys**, you can set a hotkey for "Toggle Overlay Window".
