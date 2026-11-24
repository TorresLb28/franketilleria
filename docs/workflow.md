# Flujo de trabajo del equipo

## Ramas
Una rama corta por tarea, con tu nombre: `edgar/compute-stats`, `mike/lab-selection`, `debanhi/terrain`.
Nadie sube directo a `main`. Todo entra por pull request con una aprobación de otro integrante.

## Commits
Prefijos: `test:`, `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`. Mensajes cortos, en imperativo.
En TDD, el commit `test:` (rojo) va antes que el `feat:` (verde).

## Antes de abrir un PR
```bash
git fetch origin
git merge origin/main
npm run lint
npm test
```
`main` siempre debe estar en verde. El workflow de GitHub Actions corre lint, pruebas y build en cada PR.

## Pruebas pendientes
Las funciones que todavía no existen tienen sus pruebas con `describe.skip`. Al empezar una función,
quita el `.skip` en tu rama (fase roja), implementa (fase verde) y abre el PR cuando todo pase.

## Archivos compartidos
`src/main.js`, `src/core/constants.js`, `docs/design.md` y los archivos de configuración:
avisen al equipo antes de cambiarlos.

## Evidencia para el reporte
Anota en `docs/bitacora.md` cada iteración importante con la IA. Toma capturas del código clave
y del juego conforme avanzan, no al final. Licencias de arte y sonido en `docs/credits.md`.
