# AGENTS.md — FrankenTillería

Videojuego 2D de artillería por turnos (estilo Worms) para 2 jugadores. Cada jugador
ensambla una criatura (cabeza, torso, brazos, piernas) y se enfrentan hasta que quede uno en pie.
Proyecto final de Programación Asistida por IA. Entrega: viernes 27 de noviembre de 2026.

## Stack
- JavaScript (módulos ES), Phaser 3, Vite, Vitest. Despliegue en Vercel.
- Comandos: `npm run dev`, `npm test`, `npm run build`.

## Estructura y dueños
| Carpeta | Dueño | Qué contiene |
|---|---|---|
| `src/core/`, `tests/` | Edgar | Lógica pura: stats, daño, turnos, viento. Sin Phaser. |
| `src/scenes/LabScene.js`, `data/`, `assets/sprites/` | Mike | Laboratorio, `parts.json`, arte de partes. |
| `src/scenes/BattleScene.js` | Debanhi | Combate, terreno, proyectiles, HUD, efectos. |

No modifiques archivos de otra persona sin avisar. Si necesitas un cambio en `core`, pídelo con un issue.

## Reglas de código
- `src/core/` no importa Phaser ni toca el DOM. Debe poder correr en Node.
- Las partes y armas viven en `data/parts.json` y `data/weapons.json`. No pongas números de balance en el código.
- Metodología: TDD en `core` (test que falla, implementación mínima, refactor). Ver skill `tdd-cycle`.
- Antes de usar una API de Phaser o Vitest, consulta Context7. No inventes métodos.
- Cambios pequeños: una tarea por vez, y corre `npm test` antes de dar algo por terminado.

## Estilo
- Identificadores en inglés, comentarios breves en español, solo donde expliquen un porqué.
- Sin emojis en el código, sin comentarios obvios, sin bloques de documentación repetitivos.
- Nombres cortos y concretos. Funciones pequeñas.
- Responde en español.

## Reglas del juego (resumen, detalle en docs/design.md)
- Turno: 8 s de movimiento + una sola acción de ataque.
- Gana el último jugador con vida.
- La UI siempre muestra vida de cada criatura y de quién es el turno.

## Agentes disponibles (.opencode/agents)
- `tdd-tester`: escribe tests desde el diseño. No toca código de producción.
- `balance-reviewer`: revisa `parts.json` y `weapons.json` y señala combinaciones rotas.
- `explainer`: explica código del proyecto a un integrante para prepararlo para la exposición.

## Skills disponibles (.opencode/skills)
- `add-part`: cómo agregar una parte al juego sin romper el balance.
- `tdd-cycle`: flujo de TDD del proyecto.
