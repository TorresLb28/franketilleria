// Edgar: damage of one explosion on one target.
// damage = weapon.damage * attacker.damage * falloff * (1 - target.resistance)
export function calcDamage({ weapon, attackerStats, targetStats, distance }) {
  if (distance >= weapon.radius) {
    return 0;
  }

  const safeDistance = Math.max(0, distance);
  const falloff = 1 - safeDistance / weapon.radius;
  const rawDamage = weapon.damage * attackerStats.damage * falloff * (1 - targetStats.resistance);

  return Math.max(0, Math.round(rawDamage));
}
