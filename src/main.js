import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { LabScene } from './scenes/LabScene.js';
import { BattleScene } from './scenes/BattleScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  pixelArt: true,
  backgroundColor: '#14101f',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, LabScene, BattleScene]
});
