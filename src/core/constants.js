export const BASE_STATS = Object.freeze({ hp: 100, mobility: 100, resistance: 0, damage: 1.0 });

export const LIMITS = Object.freeze({
  hpMin: 1,
  mobilityMin: 40,
  resistanceMax: 0.6,
  damageMin: 0.5
});

export const SLOTS = Object.freeze(['head', 'torso', 'arms', 'legs']);

export const TURN = Object.freeze({ moveSeconds: 8, turnSeconds: 15, maxWind: 10 });

// pixels per second = mobility * SPEED_FACTOR (100 mobility, 8 s -> 400 px)
export const SPEED_FACTOR = 0.5;

// stats are rounded to this many decimals to avoid 0.15000000000000002
export const STAT_DECIMALS = 2;
