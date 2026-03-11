/**
 * Column data shared across history and live views.
 * This file replaces the previous `history-columns.ts` name to better
 * reflect its purpose as generic column metadata.
 */

export const historyDpsPlayerColumns = [
  { key: 'totalDmg', header: 'DMG', label: 'DMG', description: "Total damage dealt by the player", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'DPS', label: 'DPS', description: "Damage per second dealt by the player", format: (v: number) => v.toFixed(1) },
  { key: 'tdps', header: 'True DPS', label: 'True DPS', description: "True DPS based on global active combat time", format: (v: number) => v.toFixed(1) },
  { key: 'bossDmg', header: 'Boss DMG', label: 'Boss DMG', description: "Damage dealt to the boss by the player", format: (v: number) => v.toLocaleString() },
  { key: 'bossDps', header: 'Boss DPS', label: 'Boss DPS', description: "Boss damage per second dealt by the player", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'DMG%', label: 'DMG%', description: "Player's share of total damage", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit%', label: 'Crit%', description: "Player's critical hit rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit DMG%', label: 'Crit DMG%', description: "Share of damage dealt as critical hits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky%', label: 'Lucky%', description: "Player's lucky strike rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky DMG%', label: 'Lucky DMG%', description: "Share of damage dealt as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Hits', label: 'Hits', description: "Total number of hits by the player", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits/Min', label: 'Hits/Min', description: "Hits per minute by the player", format: (v: number) => v.toFixed(1) },
] as const;

export const historyDpsSkillColumns = [
  { key: 'totalDmg', header: 'DMG', label: 'DMG', description: "Total damage dealt by the skill", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'DPS', label: 'DPS', description: "Damage per second for the skill", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'DMG%', label: 'DMG%', description: "Skill's share of total damage", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit%', label: 'Crit%', description: "Skill's critical hit rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit DMG%', label: 'Crit DMG%', description: "Share of skill damage dealt as critical hits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky%', label: 'Lucky%', description: "Skill's lucky strike rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky DMG%', label: 'Lucky DMG%', description: "Share of skill damage dealt as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Hits', label: 'Hits', description: "Total number of hits by the skill", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits/Min', label: 'Hits/Min', description: "Hits per minute by the skill", format: (v: number) => v.toFixed(1) },
] as const;

export const historyHealPlayerColumns = [
  { key: 'healDealt', header: 'Heal', label: 'Heal', description: "Total healing dealt by the player", format: (v: number) => v.toLocaleString() },
  { key: 'hps', header: 'HPS', label: 'HPS', description: "Healing per second dealt by the player", format: (v: number) => v.toFixed(1) },
  { key: 'healPct', header: 'Heal%', label: 'Heal%', description: "Player's share of total healing", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critHealRate', header: 'Crit%', label: 'Crit%', description: "Player's heal critical rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Heal%', label: 'Crit Heal%', description: "Share of healing dealt as critical heals", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky%', label: 'Lucky%', description: "Player's lucky heal strike rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Heal%', label: 'Lucky Heal%', description: "Share of healing dealt as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hitsHeal', header: 'Count', label: 'Count', description: "Total number of heals by the player", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Count/Min', label: 'Count/Min', description: "Heals per minute by the player", format: (v: number) => v.toFixed(1) },
] as const;

// Live meter heal player columns with correct headers
export const liveHealPlayerColumns = [
  { key: 'totalDmg', header: 'Heal', label: 'Heal', description: "Total healing dealt by the player", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'HPS', label: 'HPS', description: "Healing per second dealt by the player", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'Heal%', label: 'Heal%', description: "Player's share of total healing", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit%', label: 'Crit%', description: "Player's critical rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Heal%', label: 'Crit Heal%', description: "Share of healing dealt as critical heals", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky%', label: 'Lucky%', description: "Player's lucky strike rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Heal%', label: 'Lucky Heal%', description: "Share of healing dealt as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Count', label: 'Count', description: "Total number of heals by the player", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Count/Min', label: 'Count/Min', description: "Heals per minute by the player", format: (v: number) => v.toFixed(1) },
] as const;

// Live meter tanked player columns with correct headers
export const liveTankedPlayerColumns = [
  { key: 'totalDmg', header: 'Tanked', label: 'Tanked', description: "Total damage taken by the player", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'TPS', label: 'TPS', description: "Damage taken per second by the player", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'Tank%', label: 'Tank%', description: "Player's share of total damage taken", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit In%', label: 'Crit In%', description: "Rate at which the player is critically hit", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Tank%', label: 'Crit Tank%', description: "Share of damage taken as critical hits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky In%', label: 'Lucky In%', description: "Rate at which the player is lucky-struck", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Tank%', label: 'Lucky Tank%', description: "Share of damage taken as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Hits In', label: 'Hits In', description: "Total number of times the player was hit", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits In/Min', label: 'Hits In/Min', description: "Times hit per minute", format: (v: number) => v.toFixed(1) },
] as const;

export const liveTankedSkillColumns = [
  { key: 'totalDmg', header: 'Tanked', label: 'Tanked', description: "Total damage taken from the skill", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'DTPS', label: 'DTPS', description: "Damage taken per second from the skill", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'Tank%', label: 'Tank%', description: "Skill's share of total damage taken", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit In%', label: 'Crit In%', description: "Rate this skill critically hits the player", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Tank%', label: 'Crit Tank%', description: "Share of damage taken from this skill as crits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky In%', label: 'Lucky In%', description: "Rate this skill lucky-strikes the player", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Tank%', label: 'Lucky Tank%', description: "Share of damage taken from this skill as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Hits In', label: 'Hits In', description: "Total times hit by this skill", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits In/Min', label: 'Hits In/Min', description: "Times hit per minute by this skill", format: (v: number) => v.toFixed(1) },
] as const;

export const historyTankedPlayerColumns = [
  { key: 'damageTaken', header: 'Tanked', label: 'Tanked', description: "Total damage taken by the player", format: (v: number) => v.toLocaleString() },
  { key: 'tankedPS', header: 'TPS', label: 'TPS', description: "Damage taken per second by the player", format: (v: number) => v.toFixed(1) },
  { key: 'tankedPct', header: 'Tank%', label: 'Tank%', description: "Player's share of total damage taken", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critTakenRate', header: 'Crit In%', label: 'Crit In%', description: "Rate at which the player is critically hit", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Tank%', label: 'Crit Tank%', description: "Share of damage taken as critical hits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky In%', label: 'Lucky In%', description: "Rate at which the player is lucky-struck", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Tank%', label: 'Lucky Tank%', description: "Share of damage taken as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hitsTaken', header: 'Hits In', label: 'Hits In', description: "Total number of times the player was hit", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits In/Min', label: 'Hits In/Min', description: "Times hit per minute", format: (v: number) => v.toFixed(1) },
] as const;

export const historyTankedSkillColumns = [
  { key: 'totalDmg', header: 'Tanked', label: 'Tanked', description: "Total damage taken from the skill", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'DTPS', label: 'DTPS', description: "Damage taken per second from the skill", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'Tank%', label: 'Tank%', description: "Skill's share of total damage taken", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit In%', label: 'Crit In%', description: "Rate this skill critically hits the player", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Tank%', label: 'Crit Tank%', description: "Share of damage taken from this skill as crits", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky In%', label: 'Lucky In%', description: "Rate this skill lucky-strikes the player", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Tank%', label: 'Lucky Tank%', description: "Share of damage taken from this skill as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Hits In', label: 'Hits In', description: "Total times hit by this skill", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Hits In/Min', label: 'Hits In/Min', description: "Times hit per minute by this skill", format: (v: number) => v.toFixed(1) },
] as const;

export const historyHealSkillColumns = [
  { key: 'totalDmg', header: 'Heal', label: 'Heal', description: "Total healing dealt by the skill", format: (v: number) => v.toLocaleString() },
  { key: 'dps', header: 'HPS', label: 'HPS', description: "Healing per second for the skill", format: (v: number) => v.toFixed(1) },
  { key: 'dmgPct', header: 'Heal%', label: 'Heal%', description: "Skill's share of total healing", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critRate', header: 'Crit%', label: 'Crit%', description: "Skill's critical rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'critDmgRate', header: 'Crit Heal%', label: 'Crit Heal%', description: "Share of skill healing dealt as critical heals", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyRate', header: 'Lucky%', label: 'Lucky%', description: "Skill's lucky strike rate", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'luckyDmgRate', header: 'Lucky Heal%', label: 'Lucky Heal%', description: "Share of skill healing dealt as lucky strikes", format: (v: number) => v.toFixed(1) + '%' },
  { key: 'hits', header: 'Count', label: 'Count', description: "Total number of heals by the skill", format: (v: number) => v.toLocaleString() },
  { key: 'hitsPerMinute', header: 'Count/Min', label: 'Count/Min', description: "Heals per minute by the skill", format: (v: number) => v.toFixed(1) },
] as const;

// Aliases for live views: reuse history DPS/Heal skill definitions where appropriate
export const liveDpsPlayerColumns = historyDpsPlayerColumns;
export const liveDpsSkillColumns = historyDpsSkillColumns;
export const liveHealSkillColumns = historyHealSkillColumns;
