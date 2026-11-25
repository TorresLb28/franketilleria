import { SPEED_FACTOR, TURN } from './constants.js';
import { buildCreature } from './creature.js';
import { calcDamage } from './damage.js';
import { TurnManager } from './turns.js';
import { nextWind } from './wind.js';

const INITIAL_X = 0;
const INITIAL_Y = 0;
const PHASE_MOVE = 'move';

const buildCombatant = ({ name, partIds }, partsData, weaponsData) => {
  const creature = buildCreature(partIds, partsData, weaponsData);

  return {
    name,
    stats: creature.stats,
    weapon: creature.weapon,
    parts: creature.parts,
    hp: creature.stats.hp,
    maxHp: creature.stats.hp,
    x: INITIAL_X,
    y: INITIAL_Y,
    alive: creature.stats.hp > 0
  };
};

const rotateFrom = (combatants, currentIndex) => [
  ...combatants.slice(currentIndex),
  ...combatants.slice(0, currentIndex)
];

const distanceTo = ({ x, y }, impactPoint) => Math.hypot(x - impactPoint.x, y - impactPoint.y);

export function createBattle(roster, partsData, weaponsData, { rng } = {}) {
  if (typeof rng !== 'function') {
    throw new Error('rng is required');
  }

  return {
    combatants: roster.map((entry) => buildCombatant(entry, partsData, weaponsData)),
    rng,
    currentIndex: 0,
    wind: 0,
    phase: PHASE_MOVE,
    movementRemaining: TURN.moveSeconds,
    turnRemaining: TURN.turnSeconds,
    isOver: false,
    winner: null,
    isDraw: false
  };
}

export function beginTurn(state) {
  return {
    ...state,
    wind: nextWind(state.rng),
    phase: PHASE_MOVE,
    movementRemaining: TURN.moveSeconds,
    turnRemaining: TURN.turnSeconds
  };
}

export function moveCombatant(state, direction, deltaSeconds) {
  const effectiveSeconds = Math.max(0, Math.min(deltaSeconds, state.movementRemaining));
  const combatant = state.combatants[state.currentIndex];

  if (!combatant || !combatant.alive || effectiveSeconds === 0) {
    return { ...state };
  }

  const step = combatant.stats.mobility * SPEED_FACTOR * direction * effectiveSeconds;

  return {
    ...state,
    movementRemaining: state.movementRemaining - effectiveSeconds,
    combatants: state.combatants.map((current, index) => (
      index === state.currentIndex ? { ...current, x: current.x + step } : current
    ))
  };
}

export function resolveExplosion(state, impactPoint) {
  const attacker = state.combatants[state.currentIndex];

  if (!attacker) {
    return { ...state };
  }

  return {
    ...state,
    combatants: state.combatants.map((combatant) => {
      const damage = calcDamage({
        weapon: attacker.weapon,
        attackerStats: attacker.stats,
        targetStats: combatant.stats,
        distance: distanceTo(combatant, impactPoint)
      });
      const hp = Math.max(0, combatant.hp - damage);

      return { ...combatant, hp, alive: combatant.alive && hp > 0 };
    })
  };
}

export function advanceTurn(state) {
  const indexed = state.combatants.map((combatant, index) => ({ combatant, index }));
  const ordered = rotateFrom(indexed, state.currentIndex);
  const manager = new TurnManager(ordered.map(({ combatant, index }) => ({
    index,
    name: combatant.name,
    hp: combatant.alive ? combatant.hp : 0
  })));

  if (manager.isOver) {
    const winner = manager.winner;

    return {
      ...state,
      isOver: true,
      winner: winner ? { ...state.combatants[winner.index] } : null,
      isDraw: manager.isDraw
    };
  }

  const next = manager.current.index === state.currentIndex ? manager.next() : manager.current;

  return {
    ...state,
    currentIndex: next.index
  };
}
