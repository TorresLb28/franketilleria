---
name: tdd-cycle
description: TDD workflow for src/core features in FrankenTillería (red, green, refactor with skipped pending tests).
---
# TDD cycle

0. Branch: `git switch -c <name>/<feature>` from an up-to-date `main`.
1. **Red.** Pending features have their tests under `describe.skip`. Remove `.skip`
   (or ask the `tdd-tester` subagent for more tests), run `npm test`, and confirm the tests
   fail for the right reason. Commit as `test: ...`.
2. **Green.** Implement the minimum in `src/core/` to pass. No extra features. Commit as `feat: ...`.
3. **Refactor.** Improve names and remove duplication. Run `npm run lint` and `npm test`.
4. Run the `code-reviewer` subagent, then open the pull request. Never open it with failing tests.
5. Add an entry to `docs/bitacora.md` (prompt, result, correction).

Rules: `core` never imports Phaser; one behavior per test; never edit a test just to make it pass,
fix the code instead.
