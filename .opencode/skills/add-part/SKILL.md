---
name: add-part
description: How to add a new part (head, torso, arms, legs) or weapon to FrankenTillería without breaking balance or tests.
---
# Add a part

1. Edit `data/parts.json` and add an object with `id` (unique, snake_case, prefixed by slot),
   `slot` (`head`, `torso`, `arms`, `legs`), `name` (Spanish, shown to players), `sprite`, `mods`.
2. If the slot is `arms`, add `weapon` with a key that exists in `data/weapons.json`.
   Other slots must not have `weapon`.
3. Allowed ranges for `mods`:
   - `hp`: -20 to +50
   - `mobility`: -20 to +40
   - `resistance`: 0 to 0.15
   - `damage`: -0.1 to +0.2
4. Balance rule: every part that has bonuses must also have at least one penalty. Parts with
   empty `mods` are allowed (neutral baseline).
5. The sprite file goes in `assets/sprites/` and respects the shared anchor points agreed with Mike.
6. Run `npm test`: `tests/data.test.js` checks all of the above. Then `npm run balance`
   (or ask the `balance-reviewer` subagent) and fix any part flagged REVIEW.
7. Do not touch code to balance a part; change the numbers in `data/`.
