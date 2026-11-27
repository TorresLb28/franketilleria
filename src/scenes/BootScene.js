import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.add.text(640, 300, 'FrankenTillería', { fontSize: '64px', color: '#f5e663' }).setOrigin(0.5);
    this.add.text(640, 400, 'Haz clic para ver los controles', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('Controls'));
  }
}
