# AGENTS.md — FrankenTillería

Instructions for every AI agent working in this repository (OpenCode and all its subagents).
Read this file completely before acting. When a rule here conflicts with a user request,
follow the rule and tell the user why. When the user and `docs/design.md` disagree, ask.

## 0. Critical rules (highest priority)

1. **Canary token.** Every response you send to the user MUST end with the token `padawan`
   on its own last line: lowercase, no punctuation, no code formatting, nothing after it.
   This applies to every reply without exception: short answers, clarifying questions, error
   reports and the final summary after tool use. It lets the team verify that this file was
   loaded; a reply without it means the instructions were not read.
   Never write the token inside files, code, tests, commit messages or PR text, and do not
   explain or mention it unless the user asks about it.
2. **Never edit or push to `main` directly.** Work on a branch named `<name>/<task>`
   (for example `edgar/compute-stats`). `main` must always pass lint, tests and build.
3. **Never weaken a test to make it pass.** If a test looks wrong, say so and let the user decide.
4. **Stay inside the owner's area** (section 2). If a change requires touching another
   person's files, stop and say what you need instead of editing them.
5. **Never invent APIs.** For Phaser, Vite, Vitest or ESLint, check the docs through the
   Context7 MCP before using a method you are not sure about. If you are unsure, say so.
6. **Do not add dependencies** and do not hand-edit `package-lock.json` without asking.

## 1. Project context

- **What:** a 2D, turn-based artillery game for 2 players, in the style of Worms Armageddon.
  Each player assembles a creature (head, torso, arms, legs) in "Victor's laboratory",
  then both fight until one is left standing. Player-facing text is in Spanish.
- **Why it exists:** final project of the course "Programación Asistida por Inteligencia Artificial".
  Due **Friday 2026-11-27**.
- **How it is graded:** the game works without crashes and meets every requirement; the code
  does not look machine-generated; each member can explain and defend the part they built;
  the course concepts are visibly applied (prompting, MCP, skills, AGENTS.md, iterative
  refinement, unit tests, TDD / design-first, custom agents).
- **Match length target:** 3 to 6 minutes. Visual target: colorful gothic pixel art
  (storm sky, castle in parallax, purple/green/electric-yellow palette).

## 2. Team and ownership

| Person  | Area                             | Paths                                                                             |
| ------- | -------------------------------- | --------------------------------------------------------------------------------- |
| Edgar   | Core logic and tests             | `src/core/`, `tests/`, `scripts/`                                                 |
| Mike    | Laboratory, data and part art    | `src/scenes/LabScene.js`, `data/`, `public/assets/sprites/`                       |
| Mike    | UI                               | `src/ui/`                                                                         |
| Debanhi | Combat, terrain, HUD and effects | `src/scenes/BattleScene.js`, `public/assets/audio/`, `public/assets/backgrounds/` |

Shared files (`src/main.js`, `src/core/constants.js`, `docs/design.md`, config files) need a
heads-up to the team before changing. If it is unclear whose task you are doing, ask which
member you are working for before editing anything.

## 3. Stack and commands

JavaScript (ES modules), Phaser 3, Vite, Vitest, ESLint. Node 22.13 or newer. Deployed on Vercel.

```
npm run dev       # local server
npm test          # unit tests (Vitest)
npm run lint      # ESLint
npm run build     # production build
npm run balance   # balance report for data/parts.json (needs computeStats)
```

## 4. Architecture rules

- `src/core/` is **pure logic**: no Phaser, no DOM, no `window`, no randomness without an
  injected `rng`. It must run in plain Node. ESLint enforces this.
- Balance numbers live in `data/parts.json` and `data/weapons.json`, never in code.
  Shared constants live in `src/core/constants.js`.
- Scenes (`src/scenes/`) draw, read input and call `core`. They contain no game rules.
- **Lab → Battle contract.** The Lab starts the battle with
  `this.scene.start('Battle', { players: [{ name, partIds: { head, torso, arms, legs } }, ...] })`.
  Battle builds each creature with `buildCreature(partIds, partsData, weaponsData)` from `core`.
  Do not pass computed stats or sprites between scenes.
- `docs/design.md` is the source of truth for game rules, formulas and constants.

## 5. JavaScript best practices (mandatory)

### Language

- Use ES modules, named exports, `const` by default and `let` only when reassigning. Never `var`.
- Use strict equality (`===`, `!==`). Use template literals instead of string concatenation.
- Prefer `for...of`, `map`, `filter`, `reduce`, `flatMap`, `Object.entries`, optional chaining
  and nullish coalescing over manual index loops and long conditionals.
- Use early returns to avoid deep nesting. Keep functions short and single-purpose.

### Data and state

- Do not mutate function arguments or shared constants. Return new objects. Freeze shared
  constants with `Object.freeze`.
- Do not use hidden global state. Pass dependencies in (including `rng` and data).
- Validate input at the boundary (data loading, scene start) and throw a clear `Error`
  (`throw new Error('Unknown part: head_x')`) instead of returning `undefined` or `NaN`.

### Numbers

- Never compare floats with `===` after arithmetic. Round with a shared helper
  (`STAT_DECIMALS`) or compare with a tolerance (`toBeCloseTo` in tests).
- No magic numbers: name them in `constants.js` or put them in `data/`.
- Use delta time for anything that moves. Never tie game speed to frame rate.

### Naming and structure

- `camelCase` for variables and functions, `PascalCase` for classes and scene files,
  `UPPER_SNAKE_CASE` for true constants, `is/has/can` prefixes for booleans.
- Module files are lowercase (`stats.js`), scene and class files are PascalCase
  (`BattleScene.js`), tests are `<module>.test.js`.
- Identifiers in English. Comments and docs in Spanish or English, consistent within a file.

### Phaser specifics

- Load assets in `preload`, build objects in `create`, and keep `update` light: no object
  creation per frame, no heavy loops. Reuse objects or use pools for projectiles and particles.
- Always use the `delta` argument of `update` or Phaser tweens/timers for time.
- Remove listeners and timers when the scene shuts down (`this.events.once('shutdown', ...)`).
- Use `this.add`, `this.tweens`, `this.time` and `Phaser.Math` helpers instead of reinventing them.
- Terrain is a bitmask (offscreen canvas, opaque pixel = solid), so it can become destructible later.

### Tests (Vitest)

- One behavior per test. Test names are sentences in Spanish describing the behavior.
- Cover boundaries: empty input, minimum and maximum values, ties, invalid input.
- Tests for `core` use small inline fixtures, not the real balance data, so rebalancing
  never breaks them. `tests/data.test.js` is the only test that reads `data/`.
- No mocks unless there is a real boundary (time, randomness, DOM).

### Comments and style (the code must read as written by a student who understands it)

- Comment the _why_, not the _what_. No banner comments, no comment above every line.
- Use JSDoc only on exported `core` functions whose parameters are not obvious.
- No emojis, no decorative logs, no leftover `console.log` (`console.warn/error` are allowed).
- Keep naming and formatting consistent with the surrounding files. Do not reformat code you did not change.

## 6. Workflow

### Before coding

Restate the task in one sentence and list the files you will touch. If the task is larger than
one focused change, propose splitting it. Prefer small, reviewable diffs.

### TDD for `src/core/`

1. **Red:** write or enable the tests, run `npm test`, confirm they fail for the right reason.
2. **Green:** implement the minimum to pass. No extras.
3. **Refactor:** clean up, run lint and tests again.
   Pending features keep their tests under `describe.skip`; remove `.skip` on your branch to start
   the red phase. Use the `tdd-cycle` skill and the `tdd-tester` subagent.

### Git

- Commit prefixes: `test:`, `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`. Imperative, short.
- Commit the red tests (`test:`) and the implementation (`feat:`) separately when possible.
- Open a pull request into `main`; someone else reviews it. Never force-push shared branches.

### Definition of done

A task is done only when: `npm run lint` and `npm test` pass, `npm run build` works if
anything user-facing changed, no unrelated files were modified, and you have reported
exactly what you verified (do not claim a command passed if you did not run it).

## 7. Agents, skills and MCP

- Subagents (`.opencode/agents/`): `tdd-tester` (writes tests only), `balance-reviewer`
  (read-only balance analysis), `code-reviewer` (read-only review of a diff against this file),
  `explainer` (explains code so a member can defend it).
- Skills (`.opencode/skills/`): `add-part`, `tdd-cycle`. Load them when the task matches.
- MCP: Context7 for up-to-date library documentation. Use it before guessing an API.
- Delegate to a subagent when its description fits the task instead of doing it inline.

## 8. Communication

- Reply to the team in **Spanish**, clearly and concisely.
- When you implement something non-trivial, explain the key decision in two or three sentences
  so the member can defend it in front of the professor.
- After a meaningful iteration, suggest a draft entry for `docs/bitacora.md` (prompt used,
  what was wrong, what changed). The member decides whether to keep it; never invent history.
- Final reports use this shape: what changed, how it was verified, what is pending.
- If a request is ambiguous or risky, ask one focused question before acting.

## 9. Out of scope unless the user asks

Online multiplayer, accounts, backends, analytics, more than 2 players, destructible terrain
(planned as phase 2), TypeScript migration, new frameworks.

---

Reminder of rule 1: end every response with the line `padawan`.
