# Bitácora de Mike — iteraciones

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

## M1 Preparación <fecha 2026-11-26>

Técnica de prompting: few-shot
Prompts usados: Uno, para resumir el proyecto y entender el contexto
Qué falló o faltó: Nada
Qué cambié yo a mano: Solo hice el prompt a mano
Resultado:
Proyecto: juego 2D por turnos estilo Worms donde dos jugadores ensamblan criaturas en el laboratorio de Víctor Frankenstein y combaten con cañón, granada o rayo en un campo gótico pixel art (Phaser 3 + Vite + Vitest).
Reglas duras: trabajar siempre en rama <nombre>/<tarea> (nunca main), mantener src/core/ puro (sin Phaser, DOM ni aleatoriedad sin inyectar), dejar el balance en data/\*.json y las constantes en constants.js, y no debilitar tests ni añadir dependencias sin permiso.
Convenciones: seguir TDD con nombres de tests en español, pasar lint + test + build antes de dar por terminado, respetar la propiedad de archivos de cada miembro, consultar Context7 antes de usar APIs dudosas y responder en español.
Lo que aprendí: El contexto del proyecto.
Qué sigue:Guia de sprites

---

## M2 Guía de sprites 2026-11-26

Técnica de prompting: contexto y restricciones, con formato de refinamiento iterativo
Prompts usados: 1 (Build)
Qué falló o faltó: El archivo generado cumplió con prácticamente todas las especificaciones y restricciones desde la primera iteración. El único detalle menor es que los nombres de archivo de ejemplo (`head_eye.png`, `torso_tesla.png`, etc.) fueron inferidos por el modelo al no tener el contenido exacto de `data/parts.json` en el contexto.
Qué cambié yo a mano: Ningún cambio estructural necesario; solo verificar que los ejemplos de nombres (`head_eye.png`, `torso_tesla.png`, `arms_cannon.png`, `legs_iron.png`) coincidan exactamente con los valores `sprite` definidos en `data/parts.json`.
Resultado: docs/sprites.md de una página; PR mike/sprite-guide
Lo que aprendí: Estandarizar un lienzo base de 32 × 32 px y definir puntos de unión centrados de 8 px (x = 12…19) con fondo transparente permite apilar y combinar modularmente cualquier cabeza, torso, brazos y piernas sin desfases visuales ni retoques manuales. Además, dar un prompt estructurado con feedback técnico preciso y restricciones claras evita tener que hacer múltiples iteraciones.
Qué sigue: M3 creatureView y selectores.

---

## M3 creatureView y selectores del Laboratorio 2026-11-24

Técnica de prompting: contexto y restricciones, con formato de refinamiento iterativo, consulta a Context7 (MCP) y revisión con subagente
Prompts usados: 6 (A1 Plan, A2 Build, A3 Build, B1 Plan, B2 Build + 1 subagente revisor en Build)
Qué falló o faltó: La revisión del subagente detectó un bloqueante en `LabScene.js` (el botón «Listo» solo hacía `console.warn` y faltaba el flujo de dos jugadores hacia `Battle`); se corrigió de inmediato y quedaron pendientes los puntos marcados como «conviene corregir» y «opcional».
Qué cambié yo a mano: Revisé los diffs en VS Code y probé el laboratorio en el navegador; el subagente aplicó la corrección del bloqueante en `LabScene.js` (flujo para Jugador 1 y Jugador 2 con `this.scene.start('Battle', { players })` usando solo `name` y `partIds`).
Resultado: `src/ui/creatureView.js` y `src/scenes/LabScene.js` listos con refinamiento iterativo #1 (A2 → A3) y bloqueante resuelto; lint, pruebas (53/53) y build en verde; PR `mike/lab-selection`
Lo que aprendí: Apilar piezas en un `Container` desde el centro de los pies y separar la vista de `LabScene` permite reutilizar `createCreatureView` y `setFacing` en el combate sin duplicar lógica, y revisar con un subagente ayuda a detectar a tiempo contratos incompletos entre escenas.
Qué sigue: M4 panel de estadísticas en el Laboratorio.
