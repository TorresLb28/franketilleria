import { describe, it, expect } from 'vitest';
import { computeStats } from '../src/core/stats.js';
import { BASE_STATS } from '../src/core/constants.js';

// TODO(edgar): remove .skip on your branch to start the red phase.
describe.skip('computeStats', () => {
  it('sin partes devuelve las estadísticas base', () => {
    expect(computeStats([])).toEqual(BASE_STATS);
  });

  it('devuelve un objeto nuevo y no la constante compartida', () => {
    expect(computeStats([])).not.toBe(BASE_STATS);
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

  it('suma decimales sin error de punto flotante', () => {
    const parts = [
      { slot: 'head', mods: { resistance: 0.05 } },
      { slot: 'legs', mods: { resistance: 0.1 } }
    ];
    expect(computeStats(parts).resistance).toBe(0.15);
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

  it('el multiplicador de daño no baja de 0.5', () => {
    const parts = [{ slot: 'arms', mods: { damage: -1 } }];
    expect(computeStats(parts).damage).toBe(0.5);
  });

  it('ignora modificadores desconocidos y partes sin mods', () => {
    const parts = [{ slot: 'head', mods: { magic: 99 } }, { slot: 'legs' }];
    expect(computeStats(parts)).toEqual(BASE_STATS);
  });

  it('no modifica BASE_STATS ni las partes recibidas', () => {
    const part = Object.freeze({ slot: 'torso', mods: Object.freeze({ hp: 40 }) });
    computeStats([part]);
    expect(BASE_STATS).toEqual({ hp: 100, mobility: 100, resistance: 0, damage: 1.0 });
  });
});
