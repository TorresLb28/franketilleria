---
name: tdd-cycle
description: Flujo de TDD del proyecto para funciones de src/core. Úsalo al implementar lógica nueva.
---
# Ciclo TDD

1. Rojo: pide al agente `tdd-tester` (o escribe tú) tests en `tests/` basados en `docs/design.md`. Corre `npm test` y confirma que fallan por la razón correcta.
2. Verde: implementa lo mínimo en `src/core/` para que pasen. Nada de extras.
3. Refactor: limpia nombres y duplicación, corre `npm test` otra vez.
4. Registra en `docs/bitacora.md` qué prompt usaste y qué corregiste.
5. Haz commit con mensaje `test:` para el rojo y `feat:` para el verde.

Reglas: `core` no importa Phaser; un comportamiento por test; no cambies un test para que pase, cambia el código.
