import Phaser from 'phaser';
import partsData from '../../data/parts.json';
import { SLOTS } from '../core/constants.js';
import { createCreatureView } from '../ui/creatureView.js';

const COLORS = Object.freeze({
  background: 0x14101f,
  panel: 0x24193a,
  border: 0x7b4fbf,
  pedestal: 0x2f8f57,
  button: 0xf5e663,
  buttonHover: 0xfff3a0,
  text: '#ffffff',
  muted: '#b9a7d6'
});

const LAYOUT = Object.freeze({
  titleY: 45,
  subtitleY: 92,
  creaturePanel: Object.freeze({ x: 50, y: 130, width: 670, height: 490 }),
  optionsPanel: Object.freeze({ x: 745, y: 145, width: 485, height: 475 }),
  creature: Object.freeze({ x: 385, y: 500, scale: 3 }),
  pedestalY: 510,
  creatureLabelY: 565,
  firstRowY: 210,
  rowSpacing: 100,
  ready: Object.freeze({ x: 640, y: 665, width: 240, height: 54 })
});

const SLOT_LABELS = Object.freeze({
  head: 'Cabeza',
  torso: 'Torso',
  arms: 'Brazos',
  legs: 'Piernas'
});

function groupPartsBySlot(parts) {
  const grouped = Object.fromEntries(SLOTS.map((slot) => [slot, []]));

  for (const part of parts) {
    if (!Object.hasOwn(grouped, part?.slot)) {
      throw new Error(`Unknown slot: ${part?.slot}`);
    }
    if (typeof part.id !== 'string' || typeof part.name !== 'string') {
      throw new Error(`Invalid part: ${part.id}`);
    }
    grouped[part.slot].push(part);
  }

  for (const slot of SLOTS) {
    if (grouped[slot].length === 0) {
      throw new Error(`No parts for slot: ${slot}`);
    }
  }

  return grouped;
}

function createButton(scene, { x, y, width, height, label, fill, hoverFill, textColor, fontSize }, onClick) {
  const background = scene.add.rectangle(x, y, width, height, fill)
    .setStrokeStyle(2, COLORS.border)
    .setInteractive({ useHandCursor: true });

  const labelText = scene.add.text(x, y, label, {
    fontFamily: 'Arial',
    fontSize: fontSize ?? '26px',
    color: textColor ?? COLORS.text
  }).setOrigin(0.5);

  background.on('pointerover', () => background.setFillStyle(hoverFill));
  background.on('pointerout', () => background.setFillStyle(fill));
  background.on('pointerdown', onClick);

  return { background, label: labelText };
}

export class LabScene extends Phaser.Scene {
  constructor() {
    super('Lab');
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get isLastPlayer() {
    return this.currentPlayerIndex === this.players.length - 1;
  }

  get selectedIndices() {
    return this.currentPlayer.selectedIndices;
  }

  create() {
    this.partsBySlot = groupPartsBySlot(partsData.parts);
    this.players = ['Jugador 1', 'Jugador 2'].map((name) => ({
      name,
      selectedIndices: Object.fromEntries(SLOTS.map((slot) => [slot, 0]))
    }));
    this.currentPlayerIndex = 0;
    this.rows = {};
    this.buttons = [];
    this.creatureView = null;

    this.drawPanels();
    this.drawRows();
    this.drawReadyButton();
    this.showCurrentPlayer();

    this.events.once('shutdown', () => {
      for (const button of this.buttons) {
        button.removeAllListeners();
      }
    });
  }

  drawPanels() {
    const { creaturePanel, optionsPanel } = LAYOUT;

    for (const panel of [creaturePanel, optionsPanel]) {
      this.add.rectangle(
        panel.x + panel.width / 2,
        panel.y + panel.height / 2,
        panel.width,
        panel.height,
        COLORS.panel
      ).setStrokeStyle(2, COLORS.border);
    }

    this.titleText = this.add.text(640, LAYOUT.titleY, '', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: COLORS.text
    }).setOrigin(0.5);

    this.subtitleText = this.add.text(640, LAYOUT.subtitleY, '', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: COLORS.text
    }).setOrigin(0.5);

    this.add.ellipse(LAYOUT.creature.x, LAYOUT.pedestalY, 220, 40, COLORS.pedestal);
    this.add.text(LAYOUT.creature.x, LAYOUT.creatureLabelY, 'Tu criatura', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: COLORS.text
    }).setOrigin(0.5);
  }

  drawRows() {
    for (const [index, slot] of SLOTS.entries()) {
      const y = LAYOUT.firstRowY + index * LAYOUT.rowSpacing;

      this.add.text(775, y, SLOT_LABELS[slot], {
        fontFamily: 'Arial',
        fontSize: '26px',
        color: COLORS.text
      }).setOrigin(0, 0.5);

      const name = this.add.text(1080, y, '', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: COLORS.text,
        align: 'center',
        wordWrap: { width: 180 }
      }).setOrigin(0.5);

      const counter = this.add.text(1080, y + 30, '', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: COLORS.muted
      }).setOrigin(0.5);

      const previous = createButton(this, {
        x: 955, y, width: 48, height: 48, label: '◀',
        fill: COLORS.panel, hoverFill: COLORS.border
      }, () => this.changePart(slot, -1)).background;

      const next = createButton(this, {
        x: 1200, y, width: 48, height: 48, label: '▶',
        fill: COLORS.panel, hoverFill: COLORS.border
      }, () => this.changePart(slot, 1)).background;

      this.buttons.push(previous, next);
      this.rows[slot] = { name, counter };
    }
  }

  drawReadyButton() {
    const { background, label } = createButton(this, {
      ...LAYOUT.ready,
      label: '',
      fill: COLORS.button,
      hoverFill: COLORS.buttonHover,
      textColor: '#14101f',
      fontSize: '24px'
    }, () => this.confirmSelection());

    this.buttons.push(background);
    this.readyLabel = label;
  }

  drawCreature() {
    this.creatureView?.destroy();

    const parts = SLOTS.map((slot) => this.partsBySlot[slot][this.selectedIndices[slot]]);
    const { x, y, scale } = LAYOUT.creature;

    this.creatureView = createCreatureView(this, parts, x, y, scale);
  }

  showCurrentPlayer() {
    this.titleText.setText(`Laboratorio de Víctor · ${this.currentPlayer.name}`);
    this.subtitleText.setText(this.isLastPlayer
      ? 'Elige las piezas de tu criatura y pulsa Pelear'
      : 'Elige las piezas de tu criatura y pulsa Continuar');
    this.readyLabel.setText(this.isLastPlayer ? 'Pelear' : 'Continuar');

    for (const slot of SLOTS) {
      this.updateRow(slot);
    }

    this.drawCreature();
  }

  confirmSelection() {
    if (!this.isLastPlayer) {
      this.currentPlayerIndex += 1;
      this.showCurrentPlayer();
      return;
    }

    this.scene.start('Battle', {
      players: this.players.map((player) => ({
        name: player.name,
        partIds: this.getPartIds(player)
      }))
    });
  }

  updateRow(slot) {
    const options = this.partsBySlot[slot];
    const index = this.selectedIndices[slot];

    this.rows[slot].name.setText(options[index].name);
    this.rows[slot].counter.setText(`${index + 1} / ${options.length}`);
  }

  changePart(slot, step) {
    const count = this.partsBySlot[slot].length;
    const current = this.selectedIndices[slot];

    this.currentPlayer.selectedIndices = {
      ...this.selectedIndices,
      [slot]: (current + step + count) % count
    };

    this.updateRow(slot);
    this.drawCreature();
  }

  getPartIds(player = this.currentPlayer) {
    return Object.fromEntries(SLOTS.map((slot) => [
      slot,
      this.partsBySlot[slot][player.selectedIndices[slot]].id
    ]));
  }
}
