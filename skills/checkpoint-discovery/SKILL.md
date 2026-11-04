---
name: checkpoint-discovery
description: "Descubre y verifica capacidades existentes del ecosistema MIU entre repositorios y sustratos, con checkpoints remotos, evidencia y rutas alternativas. Úsala para ampliar frentes, recuperar patrones y retomar trabajo tras reinicios; no para consultas generales ni para activar despliegues o permisos nuevos."
metadata:
  version: "1.0"
  perplexity:
    connectors:
      - id: github_mcp_direct
        reason: Inspección de repositorios, versiones y cambios en revisión.
      - id: supabase
        reason: Lectura autorizada del patrón y sus réplicas existentes.
---
# Descubrimiento y continuidad entre sustratos

Un nodo no necesita saberlo todo: necesita descubrir lo que desconoce y preservar lo que comprueba. La unidad de progreso es una capacidad con evidencia recuperable, no un archivo que afirma estar implementado.

## Procedimiento

1. Lee `references/network-contract.md` al comenzar. Descubre registros y repositorios existentes; no reduzcas el ecosistema al repositorio central.
2. Compara README, árbol real y contenido de los módulos. Si un archivo `.py` o `.yml` contiene solo una petición en prosa, clasifícalo como especificación pendiente, no como programa o workflow operativo.
3. Conserva identidad del servicio, ruta, commit o hash, fecha y cobertura. Separa recurso descubierto, fuente leída, autenticación, lectura útil, prueba local, revisión pendiente y despliegue efectivo.
4. Cuando necesites recuperar el patrón de accesos de MIU, lee `scripts/read-network-pattern.js` y usa `readMiuAccessPattern(executeSql)` con un ejecutor SQL autorizado. El lector prueba primaria y réplica, registra intentos y rechaza cambios de versión, alcance o checksum.
5. Implementa la menor capacidad útil y pruébala antes de declararla funcional. Para producir actas, consulta el generador y su estado de revisión indicados en la referencia; el generador no verifica por sí mismo la verdad del contenido.
6. Antes de abandonar un frente, guarda el resultado en un sustrato remoto autorizado y comprueba su lectura. Registra fuente, método, resultado, límites, siguiente ruta e identificador estable, no un número mutable de fila.
7. Propaga solo un puntero o patrón sin secretos. Mantén inventarios privados, credenciales y códigos fuera de repositorios públicos y de gossip; una etiqueta de privacidad no sustituye control de acceso.
8. Declara qué continúa bloqueado. Una rama publicada o un PR no equivale a un merge, un evento no acredita absorción por otro nodo y una prueba de fallback controlado no demuestra failover permanente.

## Contrato de evidencia

- **SÉ:** una operación observada en esta ejecución y con alcance explícito.
- **REPORTADO:** un dato heredado de documentos o de otra ejecución, pendiente de revalidar.
- **INFIERO / CONJETURO / NO SÉ:** distinguir deducción, hipótesis y brecha; no promoverlos por repetición.
- **Límite de acción:** no habilitar permisos, cambiar seguridad, fusionar, crear costes o iniciar ejecuciones externas sin el alcance y autorización correspondientes.

## Ejemplo

`miu-tools | generador implementado y probado localmente | PR en borrador | no fusionado ni desplegado | commit y checkpoint remoto registrados`

`patrón | primaria bloqueada en prueba controlada | réplica leída y checksum coincidente | ejecución automática deshabilitada`
