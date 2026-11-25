# Bitácora de Edgar — iteraciones

Una entrada por iteración importante. Sirve como evidencia de refinamiento iterativo y de dirección de la IA.

## Plantilla
**Fecha / integrante:**
**Objetivo:**
**Prompt o técnica usada** (ej. few-shot, cadena de pensamiento, rol):
**Resultado de la IA:**
**Qué estaba mal o faltaba:**
**Ajuste que hice (prompt o código):**
**Resultado final:**

---
## E0 Contrato compartido, assets en public/ y bitácoras 2026-11-24
Técnica de prompting: paso a paso / refinamiento iterativo / restricciones
Prompts usados: 3 (1 en modo Plan con Context7, 2 en modo Build)
Qué falló o faltó: Ninguno; OpenCode respetó las restricciones y verificó el build en dist/
Qué cambié yo a mano: creación de public/, bitácora y ejecución de commits en Git
Resultado: lint, 7 tests y build en verde; PR edgar/contract-docs
Lo que aprendí: Vite solo copia al bundle final los archivos estáticos ubicados dentro de public/.

---
## E1 computeStats 2026-11-25
Técnica de prompting: TDD con skill tdd-cycle (rojo, verde, refactor) y revisión con @code-reviewer
Prompts usados: 4 (plan, implementación, refactor y cierre de hallazgos)
Qué falló o faltó: @code-reviewer marcó los límites repetidos, el freeze superficial de STAT_LIMITS, los comentarios de plantilla y el TODO obsoleto en el test.
Qué cambié yo a mano: activé los tests, implementé computeStats con mods conocidos, STAT_DECIMALS y LIMITS, refactoricé con Object.keys(BASE_STATS) y una tabla de límites, y apliqué los ajustes de cierre.
Resultado: 9 tests de stats en verde; cierre verificado con npm test, npm run lint y npm run build.
Lo que aprendí: Object.hasOwn evita mods desconocidos sin mutar BASE_STATS, y una tabla congelada necesita congelar también sus objetos internos.
Qué sigue: E2 buildCreature.

---
## E2 buildCreature 2026-11-25
Técnica de prompting: TDD con skill tdd-cycle (rojo, verde, refactor) y revisión con @code-reviewer
Prompts usados: 4 (plan de contrato, implementación, edge cases y cierre de bitácora)
Qué falló o faltó: se detectó discrepancia de firma en Plan antes de escribir código y se validaron edge cases de `partIds` nulo y `weapon` ausente.
Qué cambié yo a mano: activé los tests, implementé buildCreature con SLOTS y computeStats, añadí validaciones de partIds y weapon, cloné piezas/armas devueltas y limpié el bloque @Author del test.
Resultado: 24 tests + lint + build en verde; PR edgar/build-creature
Lo que aprendí: validar la frontera de entrada con mensajes concretos evita TypeError opacos y mantiene estable el contrato Lab -> Battle.
Qué sigue: E3 `src/core/battle.js`.

---
## E3 damage, wind, turns y battle.js 2026-11-25
Técnica de prompting: TDD con skill tdd-cycle (rojo, verde, refactor), subagente tdd-tester y revisión con @code-reviewer
Prompts usados: 4 (plan de contrato, fase roja, fase verde y cierre de documentación)
Qué falló o faltó: el subagente tdd-tester escribió los tests en rojo; en verde se corrigió la sincronización de `alive` vs `hp` en `advanceTurn`, y tras @code-reviewer se añadieron copias defensivas en `current` y `winner`.
Qué cambié yo a mano: activé los tests, implementé `calcDamage`, `nextWind`, `TurnManager` y el orquestador puro `battle.js` con `buildCreature`, añadí `TURN.turnSeconds`, corregí el pase de `hp` según `alive` y documenté el contrato para BattleScene.
Resultado: 51 tests en 7 suites + lint + build en verde y PR edgar/battle-core
Lo que aprendí: un orquestador puro solo compone reglas ya probadas; cuando el estado tiene `alive` y `hp`, hay que convertir esa bandera antes de delegar al módulo que decide por vida.
Qué sigue: E4 simulación headless de una pelea completa y entrega de contratos al equipo.
