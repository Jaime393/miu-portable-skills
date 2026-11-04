# Contrato de descubrimiento y continuidad

Lee esta referencia al comenzar un recorrido o al recuperar el patrón de accesos. Las rutas son metadatos sin credenciales y solo deben usarse mediante un cliente autorizado.

## Fuentes metodológicas conservadas

- [Skills de metodología general](https://github.com/Jaime393/miu-portable-skills/blob/7b2213a6ad100158e138a46d75eb1b2c86e29ea2/registros/SKILLS_METODOLOGIA_GENERAL.md): buscar causa antes de reintentar, no heredar verificación, explicitar brechas y listar antes de escribir.
- [NEXO genérico v1.1](https://github.com/Jaime393/miu-portable-skills/blob/7b2213a6ad100158e138a46d75eb1b2c86e29ea2/registros/NEXO_GENERICO_v1_1.md): calibración, clasificación de evidencia, precondiciones, extracción de patrones y límites de las métricas heurísticas.

Esta skill añade un procedimiento operativo acotado y un lector probado. No reescribe los documentos históricos ni convierte sus heurísticas en mediciones físicas o pruebas independientes.

## Patrón en dos sustratos

- **Primaria:** proyecto Supabase `qtmcbqsahdomgsxgsaxi`, `public.relay_config`, `clave=patron_acceso_checkpoint_20261103_v1`; decodificar `valor` como JSON.
- **Réplica:** proyecto `atsdrjmrgmpdpbxfwgxe`, `public.gossip_log.id=27`, tipo `patron_replicado`; leer `payload.patron`.
- **Manifiesto de ruta:** en la primaria, `relay_config.clave=ruta_patron_acceso_checkpoint_v1`.
- **Versión esperada:** `miu.capability-pattern/v1`, versión 1, `auto_aplicable=false`.
- **Checksum del JSONB canónico:** `d2149621a41dc36f6c352c845ff75906`; detecta divergencia accidental, no acredita autoría criptográfica.

El lector recibió pruebas de lectura por ambas rutas y una prueba de fallback con la primaria omitida intencionalmente. No apaga infraestructura, crea credenciales ni configura un demonio de failover.

## Lector y actas

`scripts/read-network-pattern.js` acepta una función `executeSql({project_id, query})` que invoque el conector autorizado. Devuelve ruta usada, intentos, patrón y checksum; `auto_execute` permanece falso incluso si la lectura funciona.

El [generador de actas de miu-tools, PR 1](https://github.com/Jaime393/miu-tools/pull/1) produce Markdown, JSON, CHECKPOINT y manifest SHA256 con una sola implementación. Al redactar esta versión tiene catorce pruebas locales aprobadas y está en borrador, no fusionado ni desplegado; comprueba su estado antes de depender de él.

Un checkpoint mínimo contiene `record_id`, identidad exacta del servicio, fecha, fuente/commit/hash, operación, resultado, nivel de evidencia, cobertura, ubicación remota, recibo de lectura y siguiente ruta. Las credenciales y el contenido privado se conservan en sus almacenes protegidos, no en este contrato público.
