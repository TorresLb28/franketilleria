import { describe, it, expect } from 'vitest';
import { nextWind } from '../src/core/wind.js';
import { TURN } from '../src/core/constants.js';

describe('nextWind', () => {
  it('devuelve el viento máximo negativo cuando rng devuelve 0', () => {
    expect(nextWind(() => 0)).toBe(-TURN.maxWind);
  });

  it('devuelve 0 cuando rng devuelve 0.5', () => {
    expect(nextWind(() => 0.5)).toBe(0);
  });

  it('devuelve el viento máximo positivo cuando rng devuelve 0.9999', () => {
    expect(nextWind(() => 0.9999)).toBe(TURN.maxWind);
  });

  it('devuelve un entero dentro del rango permitido para varios valores deterministas', () => {
    const values = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.9999];

    for (const value of values) {
      const wind = nextWind(() => value);
      expect(Number.isInteger(wind)).toBe(true);
      expect(wind).toBeGreaterThanOrEqual(-TURN.maxWind);
      expect(wind).toBeLessThanOrEqual(TURN.maxWind);
    }
  });
});
