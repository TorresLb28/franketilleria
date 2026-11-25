import { describe, it, expect } from 'vitest';
import {
  createBattle,
  beginTurn,
  moveCombatant,
  resolveExplosion,
  advanceTurn
} from '../src/core/battle.js';
import { TURN } from '../src/core/constants.js';

const MAX_TURNS = 50;
const WIND_SAMPLES = Object.freeze([0, 0.5, 0.99, 0.01]);

const makePartsData = () => Object.freeze({
  parts: Object.freeze([
    Object.freeze({
      id: 'head_square',
      slot: 'head',
      mods: Object.freeze({ hp: 10, resistance: 0.05, mobility: -5 })
    }),
    Object.freeze({
      id: 'head_eye',
      slot: 'head',
      mods: Object.freeze({ hp: -10, damage: 0.15 })
    }),
    Object.freeze({
      id: 'torso_stitched',
      slot: 'torso',
      mods: Object.freeze({ hp: 35, mobility: -15 })
    }),
    Object.freeze({
      id: 'torso_tesla',
      slot: 'torso',
      mods: Object.freeze({ hp: 10, damage: 0.1, mobility: -10 })
    }),
    Object.freeze({ id: 'arms_cannon', slot: 'arms', weapon: 'cannon', mods: Object.freeze({}) }),
    Object.freeze({
      id: 'legs_spring',
      slot: 'legs',
      mods: Object.freeze({ hp: -10, mobility: 30 })
    }),
    Object.freeze({
      id: 'legs_iron',
      slot: 'legs',
      mods: Object.freeze({ resistance: 0.1, mobility: -15 })
    })
  ])
});

const makeWeaponsData = () => Object.freeze({
  cannon: Object.freeze({
    name: 'Cañón',
    damage: 30,
    radius: 40,
    gravity: 1,
    windFactor: 1,
    bounces: 0
  })
});

const withoutRng = ({ rng, ...state }) => state;
const snapshotState = (state) => structuredClone(withoutRng(state));
const expectStateUnchanged = (state, snapshot, label) =>
  expect(withoutRng(state), label).toEqual(snapshot);

const snapshotData = (partsData, weaponsData) => ({
  parts: structuredClone(partsData),
  weapons: structuredClone(weaponsData)
});

const expectDataUnchanged = (partsData, weaponsData, snapshot) => {
  expect(partsData).toEqual(snapshot.parts);
  expect(weaponsData).toEqual(snapshot.weapons);
};

const expectFiniteNumbers = (value, label) => {
  if (typeof value === 'function') return;
  if (typeof value === 'number') {
    expect(Number.isFinite(value), label).toBe(true);
    return;
  }
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      expectFiniteNumbers(item, `${label}[${index}]`);
    }
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      expectFiniteNumbers(item, `${label}.${key}`);
    }
  }
};

const makeRng = () => {
  let index = 0;

  return () => WIND_SAMPLES[index++ % WIND_SAMPLES.length];
};

const makeBattle = (roster, partsData, weaponsData) =>
  createBattle(roster, partsData, weaponsData, { rng: makeRng() });

const makeRecorder = (partsData, weaponsData, dataSnapshot) => {
  const history = [];

  const record = (state, label, action) => {
    const snapshot = snapshotState(state);
    const next = action(state);

    expect(next, label).not.toBe(state);
    expectFiniteNumbers(next, label);
    expect(next.rng).toBe(state.rng);
    expectDataUnchanged(partsData, weaponsData, dataSnapshot);
    expectStateUnchanged(state, snapshot, label);
    history.push({ label, state, snapshot });

    return next;
  };

  const expectHistoryUnchanged = () => {
    for (const { label, state, snapshot } of history) {
      expectStateUnchanged(state, snapshot, label);
    }
  };

  return { record, expectHistoryUnchanged };
};

const WINNER_ROSTER = Object.freeze([
  Object.freeze({
    name: 'Jugador 1',
    partIds: Object.freeze({
      head: 'head_eye',
      torso: 'torso_tesla',
      arms: 'arms_cannon',
      legs: 'legs_spring'
    })
  }),
  Object.freeze({
    name: 'Jugador 2',
    partIds: Object.freeze({
      head: 'head_square',
      torso: 'torso_stitched',
      arms: 'arms_cannon',
      legs: 'legs_iron'
    })
  })
]);

const DRAW_ROSTER = Object.freeze([
  Object.freeze({
    name: 'Jugador 1',
    partIds: Object.freeze({
      head: 'head_square',
      torso: 'torso_stitched',
      arms: 'arms_cannon',
      legs: 'legs_iron'
    })
  }),
  Object.freeze({
    name: 'Jugador 2',
    partIds: Object.freeze({
      head: 'head_square',
      torso: 'torso_stitched',
      arms: 'arms_cannon',
      legs: 'legs_iron'
    })
  })
]);

const targetOf = (state) => state.combatants.find((_, index) => index !== state.currentIndex);

describe('simulación end-to-end con fixtures inline', () => {
  it('termina un combate completo con un ganador válido sin NaN ni mutaciones', () => {
    const partsData = makePartsData();
    const weaponsData = makeWeaponsData();
    const dataSnapshot = snapshotData(partsData, weaponsData);
    const { record, expectHistoryUnchanged } = makeRecorder(partsData, weaponsData, dataSnapshot);
    let state = makeBattle(WINNER_ROSTER, partsData, weaponsData);

    expectFiniteNumbers(state, 'estado inicial');
    expectDataUnchanged(partsData, weaponsData, dataSnapshot);
    expect(state.combatants).toHaveLength(2);

    for (let turn = 1; turn <= MAX_TURNS && !state.isOver; turn += 1) {
      state = record(state, `turno ${turn}: beginTurn`, beginTurn);
      expect(state.wind).toBeGreaterThanOrEqual(-TURN.maxWind);
      expect(state.wind).toBeLessThanOrEqual(TURN.maxWind);

      const direction = state.currentIndex === 0 ? 1 : -1;
      state = record(
        state,
        `turno ${turn}: moveCombatant`,
        (current) => moveCombatant(current, direction, TURN.moveSeconds)
      );

      const target = targetOf(state);
      expect(target, `turno ${turn}: objetivo`).toBeDefined();
      const impactPoint = { x: target.x, y: target.y };
      state = record(
        state,
        `turno ${turn}: resolveExplosion`,
        (current) => resolveExplosion(current, impactPoint)
      );

      state = record(state, `turno ${turn}: advanceTurn`, advanceTurn);
    }

    expect(state.isOver).toBe(true);
    expect(state.isDraw).toBe(false);
    expect(state.winner).not.toBeNull();
    expect(WINNER_ROSTER.map(({ name }) => name)).toContain(state.winner.name);
    expect(state.winner.alive).toBe(true);
    expect(state.winner.hp).toBeGreaterThan(0);
    expect(state.combatants.filter(({ alive }) => alive)).toHaveLength(1);
    expectFiniteNumbers(state, 'estado final');
    expectHistoryUnchanged();
    expectDataUnchanged(partsData, weaponsData, dataSnapshot);
  });

  it('termina en empate si una explosión a distancia cero deja a ambos sin vida', () => {
    const partsData = makePartsData();
    const weaponsData = makeWeaponsData();
    const dataSnapshot = snapshotData(partsData, weaponsData);
    const { record, expectHistoryUnchanged } = makeRecorder(partsData, weaponsData, dataSnapshot);
    const base = makeBattle(DRAW_ROSTER, partsData, weaponsData);
    const adjusted = {
      ...base,
      combatants: base.combatants.map((combatant) => ({
        ...combatant,
        x: 100,
        y: 0,
        hp: 1,
        maxHp: 1,
        alive: true
      }))
    };
    let state = adjusted;
    const initialSnapshot = snapshotState(adjusted);

    state = record(state, 'beginTurn', beginTurn);
    state = record(state, 'moveCombatant', (current) => moveCombatant(current, 1, 0));
    state = record(
      state,
      'resolveExplosion',
      (current) => resolveExplosion(current, { x: 100, y: 0 })
    );

    expect(state.combatants.every(({ hp, alive }) => hp === 0 && !alive)).toBe(true);

    state = record(state, 'advanceTurn', advanceTurn);

    expect(state.isOver).toBe(true);
    expect(state.isDraw).toBe(true);
    expect(state.winner).toBeNull();
    expectFiniteNumbers(state, 'estado final');
    expectHistoryUnchanged();
    expectStateUnchanged(adjusted, initialSnapshot, 'estado inicial ajustado');
    expectDataUnchanged(partsData, weaponsData, dataSnapshot);
  });
});
