import { describe, it, expect } from 'vitest';
import { calcDamage } from '../src/core/damage.js';

const weapon = Object.freeze({ damage: 30, radius: 40 });
const attackerStats = Object.freeze({ damage: 1 });
const targetStats = Object.freeze({ resistance: 0 });

describe('calcDamage', () => {
  it('devuelve el daño completo en el centro de la explosión', () => {
    expect(calcDamage({ weapon, attackerStats, targetStats, distance: 0 })).toBe(30);
  });

  it('devuelve 0 cuando la distancia es igual al radio', () => {
    expect(calcDamage({ weapon, attackerStats, targetStats, distance: 40 })).toBe(0);
  });

  it('devuelve 0 cuando la distancia es mayor que el radio', () => {
    expect(calcDamage({ weapon, attackerStats, targetStats, distance: 50 })).toBe(0);
  });

  it('aplica caída lineal a la mitad del radio', () => {
    expect(calcDamage({ weapon, attackerStats, targetStats, distance: 20 })).toBe(15);
  });

  it('aplica el multiplicador del atacante y la resistencia del objetivo', () => {
    const attacker = Object.freeze({ damage: 1.5 });
    const target = Object.freeze({ resistance: 0.2 });
    expect(calcDamage({ weapon, attackerStats: attacker, targetStats: target, distance: 0 })).toBe(36);
  });

  it('no muta los objetos recibidos', () => {
    const weaponInput = { damage: 30, radius: 40 };
    const attackerInput = { damage: 1.5 };
    const targetInput = { resistance: 0.2 };
    const weaponSnapshot = structuredClone(weaponInput);
    const attackerSnapshot = structuredClone(attackerInput);
    const targetSnapshot = structuredClone(targetInput);

    calcDamage({ weapon: weaponInput, attackerStats: attackerInput, targetStats: targetInput, distance: 10 });

    expect(weaponInput).toEqual(weaponSnapshot);
    expect(attackerInput).toEqual(attackerSnapshot);
    expect(targetInput).toEqual(targetSnapshot);
  });
});
