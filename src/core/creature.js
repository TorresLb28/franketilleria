// Edgar: turns the part ids chosen in the Lab into a creature ready to fight.
// Contract with Lab and Battle is described in docs/design.md.

/**
 * @param {{head: string, torso: string, arms: string, legs: string}} partIds
 * @param {{parts: Array}} partsData content of data/parts.json
 * @param {Object} weaponsData content of data/weapons.json
 * @returns {{stats: Object, weapon: Object, parts: Array}}
 */
export function buildCreature(partIds, partsData, weaponsData) {
  throw new Error('not implemented');
}
