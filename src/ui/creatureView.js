const PART_SIZE = 32;
const STROKE_WIDTH = 2;
const OUTLINE_COLOR = 0x14101f;

const SLOT_COLORS = Object.freeze({
  head: 0xf5e663,
  torso: 0x7b4fbf,
  arms: 0x5fbf6b,
  legs: 0x3b2a5a
});

const SLOT_OFFSETS = Object.freeze({
  legs: Object.freeze({ x: 0, y: -16 }),
  torso: Object.freeze({ x: 0, y: -48 }),
  arms: Object.freeze({ x: 0, y: -48 }),
  head: Object.freeze({ x: 0, y: -80 })
});

const DRAW_ORDER = Object.freeze(['legs', 'torso', 'arms', 'head']);

function createPartView(scene, part, slot) {
  const { x, y } = SLOT_OFFSETS[slot];

  if (scene.textures.exists(part.sprite)) {
    return scene.add.image(x, y, part.sprite);
  }

  return scene.add.rectangle(x, y, PART_SIZE, PART_SIZE, SLOT_COLORS[slot])
    .setStrokeStyle(STROKE_WIDTH, OUTLINE_COLOR);
}

export function createCreatureView(scene, parts, x, y, scale = 1) {
  if (typeof scene?.add?.container !== 'function'
    || typeof scene.add.image !== 'function'
    || typeof scene.add.rectangle !== 'function'
    || typeof scene.textures?.exists !== 'function') {
    throw new Error('scene must be a Phaser Scene');
  }

  if (!Array.isArray(parts)) {
    throw new Error('parts must be an array');
  }

  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(scale)) {
    throw new Error('x, y and scale must be finite numbers');
  }

  const partsBySlot = new Map();

  for (const part of parts) {
    if (!Object.hasOwn(SLOT_OFFSETS, part?.slot)) {
      throw new Error(`Unknown slot: ${part?.slot}`);
    }
    if (partsBySlot.has(part.slot)) {
      throw new Error(`Duplicate part for slot: ${part.slot}`);
    }
    if (typeof part.sprite !== 'string' || part.sprite.length === 0) {
      throw new Error(`Missing sprite for slot: ${part.slot}`);
    }
    partsBySlot.set(part.slot, part);
  }

  for (const slot of DRAW_ORDER) {
    if (!partsBySlot.has(slot)) {
      throw new Error(`Missing part for slot: ${slot}`);
    }
  }

  const children = DRAW_ORDER.map((slot) => createPartView(scene, partsBySlot.get(slot), slot));

  return scene.add.container(x, y, children).setScale(scale);
}

export function setFacing(view, direction) {
  if (direction !== 1 && direction !== -1) {
    throw new Error('direction must be 1 or -1');
  }

  if (typeof view?.setScale !== 'function') {
    throw new Error('view must be a Phaser Container');
  }

  const scaleX = Math.abs(view.scaleX ?? 1);
  const scaleY = Math.abs(view.scaleY ?? 1);

  return view.setScale(direction * scaleX, scaleY);
}
