// Edgar: random wind per turn. The rng is injected so the function can be tested.
import { TURN } from './constants.js';

const WIND_VALUES = TURN.maxWind * 2 + 1;

export function nextWind(rng = Math.random) {
  const sample = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON);
  return Math.floor(sample * WIND_VALUES) - TURN.maxWind;
}
