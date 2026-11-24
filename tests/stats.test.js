import { describe, it, expect } from 'vitest';
import { computeStats } from '../src/core/stats.js';
import { BASE_STATS } from '../src/core/constants.js';

describe('computeStats', () => {
  it('sin partes devuelve las estadísticas base', () => {
    expect(computeStats([])).toEqual(BASE_STATS);
  });

  it('suma los modificadores de hp y mobility', () => {
    const parts = [
      { slot: 'torso', mods: { hp: 40, mobility: -10 } },
      { slot: 'legs', mods: { mobility: 30 } }
    ];
    const s = computeStats(parts);
    expect(s.hp).toBe(140);
    expect(s.mobility).toBe(120);
  });

  it('limita la resistencia a 0.6', () => {
    const parts = [
      { slot: 'head', mods: { resistance: 0.5 } },
      { slot: 'legs', mods: { resistance: 0.5 } }
    ];
    expect(computeStats(parts).resistance).toBe(0.6);
  });

  it('nunca baja de 1 de vida ni de 40 de movilidad', () => {
    const parts = [{ slot: 'torso', mods: { hp: -500, mobility: -500 } }];
    const s = computeStats(parts);
    expect(s.hp).toBe(1);
    expect(s.mobility).toBe(40);
  });
});
