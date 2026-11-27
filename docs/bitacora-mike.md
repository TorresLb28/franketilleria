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

## M2 Guía de sprites 2026-11-24

Técnica de prompting: contexto y restricciones, con formato de refinamiento iterativo
Prompts usados: 1 (Build)
Qué falló o faltó: Nada; cumplió desde la primera vez con el formato, tamaño de una página, paleta, reglas de unión y restricciones.
Qué cambié yo a mano: Nada; solo revisé el archivo para confirmar que coincidiera con lo pedido.
Resultado: docs/sprites.md de una página; PR mike/sprite-guide
Lo que aprendí: Usar un lienzo de 32 x 32 px y uniones centradas de 8 px en los bordes hace que las 12 partes encajen en cualquier combinación sin huecos.
Qué sigue: M3 creatureView y selectores.
