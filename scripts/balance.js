// Prints how strong each combination and each part is. Run with: npm run balance
// power = effective HP * damage per shot (ignores mobility and weapon traits).
import { readFileSync } from 'node:fs';
import { computeStats } from '../src/core/stats.js';
import { SLOTS } from '../src/core/constants.js';

const WARN_AT = 0.15;

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const { parts } = readJson('../data/parts.json');
const weapons = readJson('../data/weapons.json');

function combinations(slots) {
  if (slots.length === 0) return [[]];
  const [first, ...rest] = slots;
  const options = parts.filter((p) => p.slot === first);
  return combinations(rest).flatMap((tail) => options.map((part) => [part, ...tail]));
}

function evaluate(build) {
  const stats = computeStats(build);
  const weapon = weapons[build.find((p) => p.slot === 'arms').weapon];
  const power = (stats.hp / (1 - stats.resistance)) * weapon.damage * stats.damage;
  return {
    build: build.map((p) => p.id.replace(/^[a-z]+_/, '')).join(' + '),
    ids: build.map((p) => p.id),
    hp: stats.hp,
    mobility: stats.mobility,
    power: Math.round(power)
  };
}

const rows = combinations(SLOTS).map(evaluate).sort((a, b) => b.power - a.power);
const average = rows.reduce((sum, r) => sum + r.power, 0) / rows.length;

console.log(`${rows.length} combinations, average power ${Math.round(average)}`);
console.log(`strongest/weakest ratio: ${(rows[0].power / rows.at(-1).power).toFixed(2)}`);
console.log('\nTop 5');
console.table(rows.slice(0, 5).map(({ ids, ...r }) => r));
console.log('Bottom 5');
console.table(rows.slice(-5).map(({ ids, ...r }) => r));

const perPart = parts.map((part) => {
  const withPart = rows.filter((r) => r.ids.includes(part.id));
  const mean = withPart.reduce((sum, r) => sum + r.power, 0) / withPart.length;
  const diff = (mean - average) / average;
  return {
    part: part.id,
    vsAverage: `${diff >= 0 ? '+' : ''}${(diff * 100).toFixed(1)}%`,
    flag: Math.abs(diff) > WARN_AT ? 'REVIEW' : '',
    diff
  };
}).sort((a, b) => b.diff - a.diff);

console.log('Impact per part (average power of builds that use it)');
console.table(perPart.map(({ diff, ...r }) => r));
