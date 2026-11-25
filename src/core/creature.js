// Edgar: turns the part ids chosen in the Lab into a creature ready to fight.
// Contract with Lab and Battle is described in docs/design.md.

import { SLOTS } from './constants.js';
import { computeStats } from './stats.js';

/**
 * @param {{head: string, torso: string, arms: string, legs: string}|null|undefined} partIds
 * @param {{parts: Array}} partsData content of data/parts.json
 * @param {Object} weaponsData content of data/weapons.json
 * @returns {{stats: Object, weapon: Object, parts: Array}}
 */
export function buildCreature(partIds, partsData, weaponsData) {
  if (partIds === null || partIds === undefined) {
    throw new Error('partIds is required');
  }

  const parts = SLOTS.map((slot) => {
    const partId = partIds[slot];

    if (partId === undefined) {
      throw new Error(`Missing part for slot: ${slot}`);
    }

    const part = partsData.parts.find(({ id }) => id === partId);

    if (!part) {
      throw new Error(`Unknown part: ${partId}`);
    }

    if (part.slot !== slot) {
      throw new Error(`Part ${partId} belongs to slot ${part.slot}, not slot ${slot}`);
    }

    return { ...part, mods: { ...(part.mods ?? {}) } };
  });

  const armsPart = parts[SLOTS.indexOf('arms')];
  const weaponId = armsPart.weapon;

  if (weaponId === undefined) {
    throw new Error(`Missing weapon for arms part: ${armsPart.id}`);
  }

  const weapon = weaponsData[weaponId];

  if (!weapon) {
    throw new Error(`Unknown weapon: ${weaponId}`);
  }

  return { stats: computeStats(parts), weapon: { ...weapon }, parts };
}
