# Plan de trabajo (lun 23 a vie 27 de noviembre)

| Día | Edgar (core) | Mike (laboratorio) | Debanhi (combate) |
|---|---|---|---|
| Lun 23 | Repo, `npm install`, tests de stats en rojo, `computeStats` en verde | Revisar `parts.json`, bocetos de las 12 partes | Fondo con parallax, terreno fijo, personaje placeholder que se mueve |
| Mar 24 | Tests y código de `calcDamage` y `TurnManager` | Pantalla de selección con placeholders, preview de stats | Proyectil con gravedad, explosión, HUD (vida y turno) |
| Mié 25 | `nextWind`, partida completa de pruebas, ayuda a integrar | Sprites finales, ensamblado visual de la criatura | Integrar `core`, arma por parte, fin de partida |
| Jue 26 | Pruebas finales, `balance-reviewer`, bugs | Pulido visual, pasar criaturas del Lab al Battle | Efectos (shake, partículas), sonidos, bugs |
| Vie 27 | Presentación y entrega | Presentación y entrega | Presentación y entrega |

Reglas de equipo:
- Una rama por persona (`edgar/core`, `mike/lab`, `debanhi/battle`), PR hacia `main` revisado por otro.
- Integración el miércoles. Si algo no está listo, se recorta, no se retrasa.
- Cada quien lleva su bitácora en `docs/bitacora.md` (prompt, resultado, ajuste).
- Capturas de pantalla y del código clave se toman conforme avanzan, no al final.

## Checklist de la rúbrica
- [ ] Prompting (al menos una técnica documentada)
- [ ] MCP (Context7)
- [ ] Skills (`add-part`, `tdd-cycle`)
- [ ] AGENTS.md
- [ ] Refinamiento iterativo (bitácora)
- [ ] Pruebas unitarias
- [ ] Metodología (Design-First + TDD)
- [ ] Agentes personalizados (`tdd-tester`, `balance-reviewer`, `explainer`)
- [ ] Reporte 5-10 páginas + autoevaluación de 500 palabras por integrante
- [ ] Presentación de 5-10 minutos
