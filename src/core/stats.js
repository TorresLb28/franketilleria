import { BASE_STATS, LIMITS, STAT_DECIMALS } from './constants.js';

const STAT_LIMITS = Object.freeze({
  hp: { min: LIMITS.hpMin },
  mobility: { min: LIMITS.mobilityMin },
  resistance: { max: LIMITS.resistanceMax },
  damage: { min: LIMITS.damageMin }
});

const applyLimit = ({ min = -Infinity, max = Infinity }, value) =>
  Math.min(max, Math.max(min, value));

/**
 * @param {Array<{slot: string, mods?: Object<string, number>}>} parts
 * @returns {{hp: number, mobility: number, resistance: number, damage: number}}
 */
export function computeStats(parts) {
  const totalFor = (stat) =>
    parts.reduce((sum, part) => {
      const mods = part.mods ?? {};
      return sum + (Object.hasOwn(mods, stat) ? mods[stat] : 0);
    }, BASE_STATS[stat]);

  return Object.fromEntries(
    Object.keys(BASE_STATS).map((stat) => {
      const total = Number(totalFor(stat).toFixed(STAT_DECIMALS));
      return [stat, applyLimit(STAT_LIMITS[stat], total)];
    })
  );
}
