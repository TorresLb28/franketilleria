// Edgar: turn order, alive players, winner (or draw). See docs/design.md.
export class TurnManager {
  #players;
  #currentIndex;

  constructor(players) {
    this.#players = players.map((player) => ({ ...player }));
    this.#currentIndex = this.#players.findIndex(({ hp }) => hp > 0);
  }

  get alive() {
    return this.#players.filter(({ hp }) => hp > 0).map((player) => ({ ...player }));
  }

  get current() {
    const player = this.#players[this.#currentIndex];
    return player ? { ...player } : null;
  }

  get isOver() {
    return this.alive.length <= 1;
  }

  get winner() {
    if (!this.isOver) {
      return null;
    }

    return this.alive[0] ?? null;
  }

  get isDraw() {
    return this.isOver && this.winner === null;
  }

  next() {
    if (this.isOver) {
      return this.current;
    }

    const offsets = Array.from({ length: this.#players.length }, (_, index) => index + 1);
    const nextIndex = offsets
      .map((offset) => (this.#currentIndex + offset) % this.#players.length)
      .find((index) => this.#players[index].hp > 0);

    if (nextIndex !== undefined) {
      this.#currentIndex = nextIndex;
    }

    return this.current;
  }
}
