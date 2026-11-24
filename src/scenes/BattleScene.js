import Phaser from 'phaser';

// Debanhi: combate por turnos. Usa src/core para stats, daño, turnos y viento.
export class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  create() {
    this.add.text(640, 80, 'Combate (pendiente)', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
  }
}
