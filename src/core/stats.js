import { BASE_STATS, LIMITS, STAT_DECIMALS } from './constants.js';

/**
 * @param {Array<{slot: string, mods?: Object<string, number>}>} parts
 * @returns {{hp: number, mobility: number, resistance: number, damage: number}}
 */
export function computeStats(parts) {
  const stats = { ...BASE_STATS };

  for (const part of parts) {
    if (!part.mods) continue;

    for (const [stat, value] of Object.entries(part.mods)) {
      if (Object.hasOwn(BASE_STATS, stat)) {
        stats[stat] += value;
      }
    }
  }

  const rounded = Object.fromEntries(
    Object.entries(stats).map(([stat, value]) => [stat, Number(value.toFixed(STAT_DECIMALS))])
  );

  return {
    hp: Math.max(LIMITS.hpMin, rounded.hp),
    mobility: Math.max(LIMITS.mobilityMin, rounded.mobility),
    resistance: Math.min(LIMITS.resistanceMax, rounded.resistance),
    damage: Math.max(LIMITS.damageMin, rounded.damage)
  };
}
