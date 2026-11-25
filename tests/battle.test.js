import { describe, it, expect } from 'vitest';
import { createBattle, beginTurn, moveCombatant, resolveExplosion, advanceTurn } from '../src/core/battle.js';
import { buildCreature } from '../src/core/creature.js';
import { TURN, SPEED_FACTOR } from '../src/core/constants.js';

const TURN_SECONDS = 15;

const withoutRng = ({ rng, ...state }) => state;

const snapshotState = (state) => structuredClone(withoutRng(state));

const expectStateUnchanged = (state, snapshot) => expect(withoutRng(state)).toEqual(snapshot);

const makePartsData = () => Object.freeze({
  parts: Object.freeze([
    Object.freeze({ id: 'h1', slot: 'head', mods: Object.freeze({ hp: 10 }) }),
    Object.freeze({ id: 't1', slot: 'torso', mods: Object.freeze({ hp: 10 }) }),
    Object.freeze({ id: 'a1', slot: 'arms', weapon: 'cannon', mods: Object.freeze({}) }),
    Object.freeze({ id: 'l1', slot: 'legs', mods: Object.freeze({ mobility: 20 }) })
  ])
});

const makeWeaponsData = () => Object.freeze({
  cannon: Object.freeze({ name: 'Cañón', damage: 30, radius: 40, gravity: 1, windFactor: 1, bounces: 0 })
});

const makeRoster = () => Object.freeze([
  Object.freeze({ name: 'Jugador 1', partIds: Object.freeze({ head: 'h1', torso: 't1', arms: 'a1', legs: 'l1' }) }),
  Object.freeze({ name: 'Jugador 2', partIds: Object.freeze({ head: 'h1', torso: 't1', arms: 'a1', legs: 'l1' }) })
]);

const makeBattle = (rng = () => 0.5) => createBattle(makeRoster(), makePartsData(), makeWeaponsData(), { rng });

const withCombatants = (state, combatants, extra = {}) => ({
  ...state,
  combatants,
  ...extra
});

describe('createBattle', () => {
  it('construye combatientes con buildCreature y estado inicial esperado', () => {
    const roster = makeRoster();
    const partsData = makePartsData();
    const weaponsData = makeWeaponsData();
    const expectedCreature = buildCreature(roster[0].partIds, partsData, weaponsData);
    const state = createBattle(roster, partsData, weaponsData, { rng: () => 0.5 });

    expect(state.combatants).toHaveLength(2);
    expect(state.combatants[0].name).toBe('Jugador 1');
    expect(state.combatants[0].hp).toBe(120);
    expect(state.combatants[0].maxHp).toBe(120);
    expect(state.combatants[0].alive).toBe(true);
    expect(state.combatants[0].stats).toEqual({ hp: 120, mobility: 120, resistance: 0, damage: 1 });
    expect(state.combatants[0].weapon).toEqual(weaponsData.cannon);
    expect(state.combatants[0].parts).toHaveLength(4);
    expect(state.combatants[0].parts).toEqual(expectedCreature.parts);
    expect(Number.isFinite(state.combatants[0].x)).toBe(true);
    expect(Number.isFinite(state.combatants[0].y)).toBe(true);
  });

  it('no muta roster, partsData ni weaponsData', () => {
    const roster = makeRoster();
    const partsData = makePartsData();
    const weaponsData = makeWeaponsData();
    const rosterSnapshot = structuredClone(roster);
    const partsSnapshot = structuredClone(partsData);
    const weaponsSnapshot = structuredClone(weaponsData);

    createBattle(roster, partsData, weaponsData, { rng: () => 0.5 });

    expect(roster).toEqual(rosterSnapshot);
    expect(partsData).toEqual(partsSnapshot);
    expect(weaponsData).toEqual(weaponsSnapshot);
  });
});

describe('beginTurn', () => {
  it('con rng 0.5 inicializa viento y tiempos del turno sin mutar el estado original', () => {
    const state = makeBattle(() => 0.5);
    const snapshot = snapshotState(state);

    const next = beginTurn(state);

    expect(next.wind).toBe(0);
    expect(next.movementRemaining).toBe(TURN.moveSeconds);
    expect(next.turnRemaining).toBe(TURN_SECONDS);
    expect(next.phase).toBe('move');
    expectStateUnchanged(state, snapshot);
  });

  it('con rng 0 produce el viento máximo negativo', () => {
    const state = makeBattle(() => 0);

    const next = beginTurn(state);

    expect(next.wind).toBe(-TURN.maxWind);
  });
});

describe('moveCombatant', () => {
  it('desplaza al combatiente según movilidad, delta y reduce el tiempo de movimiento', () => {
    const state = beginTurn(makeBattle(() => 0.5));
    const snapshot = snapshotState(state);

    const next = moveCombatant(state, 1, 2);

    expect(next.combatants[0].x)
      .toBe(state.combatants[0].x + state.combatants[0].stats.mobility * SPEED_FACTOR * 2);
    expect(next.movementRemaining).toBe(TURN.moveSeconds - 2);
    expectStateUnchanged(state, snapshot);
  });

  it('limita el movimiento al tiempo restante del turno', () => {
    const state = beginTurn(makeBattle(() => 0.5));

    const next = moveCombatant(state, 1, 20);

    const expectedStep = state.combatants[0].stats.mobility * SPEED_FACTOR;

    expect(next.combatants[0].x).toBe(state.combatants[0].x + expectedStep * TURN.moveSeconds);
    expect(next.movementRemaining).toBe(0);
    expect(next.combatants[0].x).not.toBe(state.combatants[0].x + expectedStep * 20);
  });
});

describe('resolveExplosion', () => {
  it('aplica daño a todos los combatientes dentro del radio, incluido el atacante', () => {
    const base = makeBattle(() => 0.5);
    const state = withCombatants(base, [
      { ...base.combatants[0], x: 100, y: 0 },
      { ...base.combatants[1], x: 130, y: 0 }
    ], { currentIndex: 0 });
    const snapshot = snapshotState(state);

    const next = resolveExplosion(state, { x: 100, y: 0 });

    expect(next.combatants[0].hp).toBe(90);
    expect(next.combatants[1].hp).toBe(112);
    expectStateUnchanged(state, snapshot);
  });

  it('marca como muerto a un combatiente si su hp llega a 0', () => {
    const base = makeBattle(() => 0.5);
    const state = withCombatants(base, [
      { ...base.combatants[0], x: 100, y: 0, hp: 5, alive: true },
      { ...base.combatants[1], x: 500, y: 0 }
    ], { currentIndex: 0 });

    const next = resolveExplosion(state, { x: 100, y: 0 });

    expect(next.combatants[0].hp).toBe(0);
    expect(next.combatants[0].alive).toBe(false);
  });
});

describe('advanceTurn', () => {
  it('alterna el turno entre dos combatientes vivos sin mutar el estado original', () => {
    const state = makeBattle(() => 0.5);
    const snapshot = snapshotState(state);

    const next = advanceTurn(state);
    const next2 = advanceTurn(next);

    expect(next.currentIndex).toBe(1);
    expect(next2.currentIndex).toBe(0);
    expectStateUnchanged(state, snapshot);
  });

  it('salta a un combatiente muerto', () => {
    const base = makeBattle(() => 0.5);
    const third = { ...base.combatants[0], name: 'Jugador 3' };
    const state = withCombatants(base, [
      { ...base.combatants[0], alive: true },
      { ...base.combatants[1], alive: false },
      { ...third, alive: true }
    ], { currentIndex: 0 });

    const next = advanceTurn(state);

    expect(next.currentIndex).toBe(2);
  });

  it('marca ganador cuando queda un solo combatiente vivo', () => {
    const base = makeBattle(() => 0.5);
    const state = withCombatants(base, [
      { ...base.combatants[0], name: 'Único vivo', alive: true, hp: 10 },
      { ...base.combatants[1], alive: false, hp: 0 }
    ], { currentIndex: 0 });

    const next = advanceTurn(state);

    expect(next.isOver).toBe(true);
    expect(next.winner.name).toBe('Único vivo');
    expect(next.isDraw).toBe(false);
  });

  it('marca empate cuando no queda ningún combatiente vivo', () => {
    const base = makeBattle(() => 0.5);
    const state = withCombatants(base, [
      { ...base.combatants[0], alive: false, hp: 0 },
      { ...base.combatants[1], alive: false, hp: 0 }
    ], { currentIndex: 0 });

    const next = advanceTurn(state);

    expect(next.isOver).toBe(true);
    expect(next.winner).toBeNull();
    expect(next.isDraw).toBe(true);
  });
});
