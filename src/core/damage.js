// Edgar: daño de una explosión sobre un objetivo.
// damage = weapon.damage * attacker.damage * falloff(distancia, radio) * (1 - target.resistance)
export function calcDamage({ weapon, attackerStats, targetStats, distance }) {
  throw new Error('not implemented');
}
