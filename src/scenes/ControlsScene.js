import Phaser from 'phaser';
import { TURN } from '../core/constants.js';

const COLORS = Object.freeze({
  background: 0x14101f,
  panel: 0x24193a,
  border: 0x7b4fbf,
  title: '#f5e663',
  text: '#ffffff',
  muted: '#b9a7d6'
});

const LAYOUT = Object.freeze({
  centerX: 640,
  titleY: 70,
  objectiveY: 145,
  leftPanelX: 320,
  rightPanelX: 960,
  panelY: 330,
  panelWidth: 540,
  panelHeight: 300,
  headingY: 225,
  firstLineY: 290,
  lineSpacing: 48,
  notesY: 535,
  noteSpacing: 33,
  promptY: 670
});

function createPanel(scene, x, heading, lines) {
  scene.add.rectangle(x, LAYOUT.panelY, LAYOUT.panelWidth, LAYOUT.panelHeight, COLORS.panel)
    .setStrokeStyle(2, COLORS.border);

  scene.add.text(x, LAYOUT.headingY, heading, {
    fontFamily: 'Arial',
    fontSize: '32px',
    fontStyle: 'bold',
    color: COLORS.title
  }).setOrigin(0.5);

  for (const [index, line] of lines.entries()) {
    scene.add.text(x, LAYOUT.firstLineY + index * LAYOUT.lineSpacing, line, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: COLORS.text
    }).setOrigin(0.5);
  }
}

export class ControlsScene extends Phaser.Scene {
  constructor() { super('Controls'); }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add.text(LAYOUT.centerX, LAYOUT.titleY, 'CÓMO JUGAR', {
      fontFamily: 'Arial',
      fontSize: '56px',
      fontStyle: 'bold',
      color: COLORS.title
    }).setOrigin(0.5);

    this.add.text(LAYOUT.centerX, LAYOUT.objectiveY, 'Deja sin vida a tu rival', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: COLORS.text
    }).setOrigin(0.5);

    createPanel(this, LAYOUT.leftPanelX, `Movimiento (${TURN.moveSeconds} s)`, [
      '← → o A D para caminar',
      'Enter para terminar antes'
    ]);

    createPanel(this, LAYOUT.rightPanelX, `Ataque (${TURN.turnSeconds} s)`, [
      'Mouse o ↑ ↓ para apuntar',
      'Mantén Espacio para cargar',
      'la potencia y suéltalo para disparar'
    ]);

    const notes = [
      'Una sola acción de ataque por turno.',
      'El viento cambia cada turno.',
      'Gana el último en pie.'
    ];

    for (const [index, note] of notes.entries()) {
      this.add.text(LAYOUT.centerX, LAYOUT.notesY + index * LAYOUT.noteSpacing, note, {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: COLORS.muted
      }).setOrigin(0.5);
    }

    this.add.text(LAYOUT.centerX, LAYOUT.promptY, 'Haz clic o pulsa Enter para continuar', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: COLORS.title
    }).setOrigin(0.5);

    const goToLab = () => this.scene.start('Lab');
    this.input.once('pointerdown', goToLab);
    this.input.keyboard.once('keydown-ENTER', goToLab);
    this.events.once('shutdown', () => {
      this.input.off('pointerdown', goToLab);
      this.input.keyboard.off('keydown-ENTER', goToLab);
    });
  }
}
