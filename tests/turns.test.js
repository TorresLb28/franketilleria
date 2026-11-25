import { describe, it, expect } from 'vitest';
import { TurnManager } from '../src/core/turns.js';

const makePlayers = () => Object.freeze([
  Object.freeze({ name: 'A', hp: 100 }),
  Object.freeze({ name: 'B', hp: 100 })
]);

describe('TurnManager', () => {
  it('alterna el turno entre A y B', () => {
    const tm = new TurnManager(makePlayers());

    expect(tm.current.name).toBe('A');
    tm.next();
    expect(tm.current.name).toBe('B');
    tm.next();
    expect(tm.current.name).toBe('A');
  });

  it('salta a un jugador con hp 0', () => {
    const players = Object.freeze([
      Object.freeze({ name: 'A', hp: 100 }),
      Object.freeze({ name: 'B', hp: 0 }),
      Object.freeze({ name: 'C', hp: 100 })
    ]);
    const tm = new TurnManager(players);

    expect(tm.current.name).toBe('A');
    tm.next();
    expect(tm.current.name).toBe('C');
  });

  it('marca ganador cuando queda un solo jugador vivo', () => {
    const players = Object.freeze([
      Object.freeze({ name: 'A', hp: 100 }),
      Object.freeze({ name: 'B', hp: 0 })
    ]);
    const tm = new TurnManager(players);

    expect(tm.isOver).toBe(true);
    expect(tm.winner.name).toBe('A');
    expect(tm.isDraw).toBe(false);
  });

  it('marca empate cuando no queda ningún jugador vivo', () => {
    const players = Object.freeze([
      Object.freeze({ name: 'A', hp: 0 }),
      Object.freeze({ name: 'B', hp: 0 })
    ]);
    const tm = new TurnManager(players);

    expect(tm.isOver).toBe(true);
    expect(tm.winner).toBeNull();
    expect(tm.isDraw).toBe(true);
  });

  it('no muta el arreglo de jugadores recibido', () => {
    const players = [
      { name: 'A', hp: 100 },
      { name: 'B', hp: 100 }
    ];
    const snapshot = structuredClone(players);

    const tm = new TurnManager(players);
    tm.next();

    expect(players).toEqual(snapshot);
  });
});
