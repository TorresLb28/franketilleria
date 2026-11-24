import { describe, it, expect } from 'vitest';
import { buildCreature } from '../src/core/creature.js';

// Fixtures are small on purpose: these tests must not depend on the balance in data/.
const partsData = {
  parts: [
    { id: 'h1', slot: 'head', mods: { hp: 10 } },
    { id: 't1', slot: 'torso', mods: { hp: 20 } },
    { id: 'a1', slot: 'arms', weapon: 'gun', mods: {} },
    { id: 'a2', slot: 'arms', weapon: 'missing', mods: {} },
    { id: 'l1', slot: 'legs', mods: { mobility: 10 } }
  ]
};
const weaponsData = { gun: { damage: 30, radius: 40 } };
const ids = { head: 'h1', torso: 't1', arms: 'a1', legs: 'l1' };

// TODO(edgar): remove .skip on your branch to start the red phase.
describe.skip('buildCreature', () => {
  it('devuelve stats combinadas y el arma de los brazos', () => {
    const c = buildCreature(ids, partsData, weaponsData);
    expect(c.stats.hp).toBe(130);
    expect(c.stats.mobility).toBe(110);
    expect(c.weapon).toEqual(weaponsData.gun);
    expect(c.parts).toHaveLength(4);
  });

  it('lanza error si un id no existe', () => {
    expect(() => buildCreature({ ...ids, head: 'nope' }, partsData, weaponsData)).toThrow(/unknown part/i);
  });

  it('lanza error si el id pertenece a otro slot', () => {
    expect(() => buildCreature({ ...ids, head: 't1' }, partsData, weaponsData)).toThrow(/slot/i);
  });

  it('lanza error si falta un slot', () => {
    const incomplete = { head: ids.head, torso: ids.torso, arms: ids.arms };
    expect(() => buildCreature(incomplete, partsData, weaponsData)).toThrow(/legs/i);
  });

  it('lanza error si el arma de los brazos no existe', () => {
    expect(() => buildCreature({ ...ids, arms: 'a2' }, partsData, weaponsData)).toThrow(/weapon/i);
  });
});
