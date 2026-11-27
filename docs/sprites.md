# Guía de arte de las partes de la criatura

Todas las piezas comparten el mismo lienzo para que cualquier combinación encaje sin retoques.

## Lienzo y apilado

- Cada parte es un PNG de **32 × 32 px**, con fondo transparente, dibujada **mirando a la derecha**.
- Apilado de arriba abajo: **cabeza en y = 0**, **torso en y = 32**, **piernas en y = 64**.
- Los **brazos** (con su arma incluida) se dibujan **encima del torso**, en sus mismas coordenadas (y = 32).
- La criatura completa mide **32 × 96 px** y su origen es el **centro de los pies** (x = 16, y = 96 del conjunto).

| Franja (px) | Slot | Posición |
|---|---|---|
| 0–31 | `head` | y = 0 |
| 32–63 | `torso` + `arms` (superpuestos) | y = 32 |
| 64–95 | `legs` | y = 64 |

## Uniones

- Cada cuadro lleva un **cuello o cintura de 8 px de ancho, centrado** (x = 12…19) en el borde que se acopla.
- El resto del borde se deja transparente para que encaje con cualquier combinación.
- El arma no se exporta aparte: va dentro del sprite de brazos y apunta hacia la derecha en reposo.

## Archivos

El nombre del PNG es exactamente el campo `sprite` de `data/parts.json`:

```text
public/assets/sprites/<sprite>.png
```

Ejemplos: `head_eye.png`, `torso_tesla.png`, `arms_cannon.png`, `legs_iron.png`. Hay 3 sprites por slot (`head_*`, `torso_*`, `arms_*`, `legs_*`).

## Paleta y estilo

Pixel art gótico y colorido: siluetas oscuras, contraste fuerte y pocos colores.

| Color | Uso sugerido |
|---|---|
| `#14101F` | Contorno y sombras |
| `#3B2A5A` | Bases oscuras y metal |
| `#7B4FBF` | Acento morado (tela, energía) |
| `#5FBF6B` | Verde (resortes, toxina, ojos) |
| `#F5E663` | Amarillo eléctrico (chispas, rayo) |
| `#F2F2F2` | Brillos, huesos y costuras |

## Herramienta y licencias

Dibuja en **Piskel** (piskelapp.com) o **LibreSprite** con cuadrícula de 32 × 32 y transparencia; exporta el PNG sin escalar. Todo recurso externo debe registrarse antes en `docs/credits.md` con autor, fuente y licencia.

Comprobación rápida: 32 × 32, transparente, mirando a la derecha, unión de 8 px centrada y nombre igual al `sprite` de `parts.json`.
