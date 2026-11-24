import { describe, it, expect } from 'vitest';
import partsData from '../data/parts.json';
import weapons from '../data/weapons.json';
import { SLOTS } from '../src/core/constants.js';

// Ranges come from .opencode/skills/add-part/SKILL.md
const RANGES = {
  hp: [-20, 50],
  mobility: [-20, 40],
  resistance: [0, 0.15],
  damage: [-0.1, 0.2]
};

const { parts } = partsData;

describe('data/parts.json', () => {
  it('todos los ids son únicos', () => {
    const ids = parts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada slot tiene al menos 3 partes', () => {
    for (const slot of SLOTS) {
      expect(parts.filter((p) => p.slot === slot).length, slot).toBeGreaterThanOrEqual(3);
    }
  });

  it('todas las partes tienen un slot válido, nombre y sprite', () => {
    for (const p of parts) {
      expect(SLOTS, p.id).toContain(p.slot);
      expect(p.name, p.id).toBeTruthy();
      expect(p.sprite, p.id).toBeTruthy();
    }
  });

  it('los modificadores respetan los rangos permitidos', () => {
    for (const p of parts) {
      for (const [key, value] of Object.entries(p.mods)) {
        expect(RANGES, `${p.id}.${key}`).toHaveProperty(key);
        const [min, max] = RANGES[key];
        expect(value, `${p.id}.${key}`).toBeGreaterThanOrEqual(min);
        expect(value, `${p.id}.${key}`).toBeLessThanOrEqual(max);
      }
    }
  });

  it('toda parte con modificadores tiene al menos una penalización', () => {
    for (const p of parts) {
      const values = Object.values(p.mods);
      if (values.length === 0) continue;
      expect(values.some((v) => v < 0), p.id).toBe(true);
    }
  });

  it('solo los brazos traen arma, y esa arma existe', () => {
    for (const p of parts) {
      if (p.slot === 'arms') {
        expect(weapons, p.id).toHaveProperty(p.weapon);
      } else {
        expect(p.weapon, p.id).toBeUndefined();
      }
    }
  });
});

describe('data/weapons.json', () => {
  it('cada arma tiene valores válidos', () => {
    for (const [key, w] of Object.entries(weapons)) {
      expect(w.name, key).toBeTruthy();
      expect(w.damage, key).toBeGreaterThan(0);
      expect(w.radius, key).toBeGreaterThan(0);
      expect(w.windFactor, key).toBeGreaterThanOrEqual(0);
      expect(w.windFactor, key).toBeLessThanOrEqual(1);
      expect(w.bounces, key).toBeGreaterThanOrEqual(0);
    }
  });
});
