---
name: add-part
description: Cómo agregar una parte nueva (cabeza, torso, brazos, piernas) a FrankenTillería sin romper el balance.
---
# Agregar una parte

1. Abre `data/parts.json` y agrega un objeto con:
   `id` (único, snake_case), `slot` (`head`, `torso`, `arms`, `legs`), `name`, `sprite`, `mods`.
2. Si el slot es `arms`, agrega `weapon` con una clave que exista en `data/weapons.json`.
3. Rangos permitidos en `mods`:
   - `hp`: -20 a +50
   - `mobility`: -20 a +40
   - `resistance`: 0 a 0.15
   - `damage`: -0.1 a +0.2
4. Regla de balance: una parte con un bono alto debe tener una penalización. La suma de bonos y penalizaciones debe quedar cerca de 0.
5. El sprite debe estar en `assets/sprites/` y respetar los puntos de anclaje definidos con Mike.
6. Corre `npm test`. Si los tests de stats pasan, pide una revisión al agente `balance-reviewer`.
