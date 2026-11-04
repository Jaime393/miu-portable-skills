# miu-portable-skills

Biblioteca de procedimientos reutilizables del ecosistema MIU. El contenido existente se distingue de las capacidades ejecutables y de las propuestas pendientes de revisión.

## Fuentes y capacidades

- **Metodología general:** [registros/SKILLS_METODOLOGIA_GENERAL.md](registros/SKILLS_METODOLOGIA_GENERAL.md), con diagnóstico de errores, trazabilidad y límites epistémicos.
- **NEXO genérico:** [registros/NEXO_GENERICO_v1_1.md](registros/NEXO_GENERICO_v1_1.md), núcleo portable de razonamiento y clasificación de evidencia.
- **Continuidad entre sustratos:** [skills/checkpoint-discovery/SKILL.md](skills/checkpoint-discovery/SKILL.md), skill nueva derivada de esas fuentes, con checkpoints remotos y lector de patrón por primaria/réplica.
- **Lector:** [scripts/read-network-pattern.js](skills/checkpoint-discovery/scripts/read-network-pattern.js), sin credenciales incluidas; requiere un ejecutor SQL autorizado y no ejecuta el patrón recuperado.

## Validar la incorporación

```bash
agentskills validate skills/checkpoint-discovery
node tests/test_network_reader.js
```

Las seis pruebas de Node son simuladas y comprueban selección de rutas, fallback, divergencia, alcance y formato. Las lecturas reales por ambas rutas y el fallback controlado del lector se documentan separadamente en el contrato de red.

## Límites de esta revisión

No se instalaron dependencias de modelos, se otorgaron permisos ni se despacharon workflows. La skill no está fusionada por el solo hecho de estar en una rama, y no hereda disponibilidad de módulos mencionados por documentos antiguos.

El archivo histórico `.github/workflows/reject-test-contamination.yml` contiene una especificación en prosa, no un workflow implementado. No se modifica como parte de esta incorporación; los documentos históricos y los fixtures existentes se conservan.
