import Phaser from 'phaser';

// Mike: laboratorio de Víctor. Cada jugador elige cabeza, torso, brazos y piernas.
// Al terminar, llamar a this.scene.start('Battle', { players: [...] }).
export class LabScene extends Phaser.Scene {
  constructor() { super('Lab'); }

  create() {
    this.add.text(640, 80, 'Laboratorio (pendiente)', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('Battle'));
  }
}
