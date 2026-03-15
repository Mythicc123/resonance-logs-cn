/**
 * @file This file defines the tool routes for the toolbox sidebar.
 */
import ActivityIcon from "virtual:icons/lucide/activity";
import CalculatorIcon from "virtual:icons/lucide/calculator";
import HourglassIcon from "virtual:icons/lucide/hourglass";
import PaletteIcon from "virtual:icons/lucide/palette";
import SettingsIcon from "virtual:icons/lucide/settings";
import ShieldAlertIcon from "virtual:icons/lucide/shield-alert";
import SwordsIcon from "virtual:icons/lucide/swords";

// Tool-level routes for the left sidebar
export const TOOL_ROUTES = {
  "/main/dps": { label: "DPS Meter", icon: ActivityIcon },
  "/main/module-calc": { label: "Mod Calculator", icon: CalculatorIcon },
  "/main/skill-monitor": { label: "Live Monitor", icon: SwordsIcon },
  "/main/monster-monitor": { label: "Monster Monitor", icon: ShieldAlertIcon },
};

// Sub-routes for DPS tool (tabs in the right panel)
export const DPS_SUB_ROUTES = {
  "/main/dps/history": { label: "History", icon: HourglassIcon },
  "/main/dps/themes": { label: "Theme", icon: PaletteIcon },
  "/main/dps/settings": { label: "Settings", icon: SettingsIcon },
};

// Legacy export for backward compatibility (if needed)
export const SIDEBAR_ROUTES = DPS_SUB_ROUTES;
