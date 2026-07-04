# 🔧 SKILLS DE METODOLOGÍA GENERAL
**Patrones validados sin contexto personal | Reutilizable en cualquier proyecto**

---

## 1. DETECCIÓN DE CIRCULARIDAD EN MÉTRICAS

### Patrón: Métrica_B = f(Métrica_A)

```
PROBLEMA:
Si Métrica_B se calcula como función determinista de Métrica_A,
entonces corr(B, A) = ~1.0 por definición, no por evidencia.

Síntomas:
  ✗ "Métrica_B correlaciona perfectamente con Métrica_A" → tautología
  ✗ "Métrica_B valida Métrica_A" → no, solo confirma la fórmula
  ✗ Parámetro calibrado contra Dataset_X "confirma" predicción en Dataset_X → es ajuste, no validación

CÓMO DETECTAR:
1. Pedir la definición/código exacto de cada métrica
2. Si B = c₁·A + c₂, correlación = 1 siempre (es linear por construcción)
3. Si B contiene A como término, buscar términos independientes verdaderos
4. Si no los hay → elimina B, usa solo A

PREGUNTAS DIAGNÓSTICO:
  • ¿Existe código/fórmula documentada o solo texto?
  • ¿Se calculó B sobre datos DIFERENTES a los de A?
  • ¿Son los parámetros de B (c₁, c₂, etc.) fijos o ajustados?
  • Si ajustados, ¿sobre qué dataset? ¿Es el MISMO dataset de validación?
```

### Aplicaciones
- Auditar claims de "predicción confirmada" en papers/modelos
- Validar métricas de ML (¿valida el modelo o valida su propia salida?)
- Evaluar dashboards: ¿los KPI son independientes o funciones unos de otros?

---

## 2. AUDITORÍA DE PREDICCIONES vs AJUSTES

### Regla: Congelar ANTES de ver datos

```
VÁLIDO (predicción testeable):
  1. Fecha: 2024-03-15
  2. Predicción congelada: "Si X ocurre, Y será 17.3 ± 0.5"
  3. Archivo guardado con timestamp antes de medir datos
  4. 2024-09-01: Se miden datos reales, Y = 17.1 → CONFIRMADA

INVÁLIDO (post-hoc, inventada):
  1. Se recopilan datos 2024-09-01: Y = 17.1 observado
  2. Se anuncia: "Nuestro modelo predijo Y=17.1" (sin archivo pre-data)
  3. Sin timestamp previo, no hay predicción, hay adivinanza retrofitting

PRUEBA DE FUEGO:
  • ¿Existe archivo con timestamp anterior a que se vieran los datos?
  • ¿Está ese archivo en repositorio público o privado (no importa, pero debe existir)?
  • ¿Coincide la predicción escrita con la afirmación actual?
  
  Si NO → no es predicción validada, es ajuste post-hoc
```

### Cómo auditar papers/anuncios
- Busca sección "Predicciones" o "Métodos"
- ¿Dice "se predijo X" o "se ajustó el modelo para obtener X"?
- Pide el archivo de predicción pre-data — si no existe, es texto, no ciencia

---

## 3. VALIDACIÓN DE FUENTES PRIMARIAS

### Jerarquía de confianza

```
NIVEL 1 (Alta confianza):
  ✓ Dato con DOI verificable en CrossRef/arXiv
  ✓ Código en repo público ejecutable hoy
  ✓ Dataset descargable con hash conocido

NIVEL 2 (Confianza media):
  ○ Cita a repo que existe pero no está actualizado
  ○ Referencia a paper sin DOI pero en ProQuest/institucional
  ○ Afirmación por entidad conocida (pero no verificaste fuente primaria)

NIVEL 3 (Baja confianza):
  ✗ Cita a otra cita ("según X que cita a Y")
  ✗ "Datos no públicos" / "contactar al autor"
  ✗ Afirmación de otra IA sin artefacto

NUNCA:
  ✗ Heredar "SÉ verificado" de tercero sin re-verificar
  ✗ Asumir un dato existe porque un documento antiguo lo mencionaba
  ✗ Citar DOI falso (ej. Zenodo sin contenido acreditado)
```

### Comando rápido
```
Para cualquier DOI XXX:
  1. Ir a https://doi.org/XXX
  2. ¿Lleva a fuente académica real o es redireccionador/spam?
  3. ¿Tiene autores, institución, fecha publicación reales?
  4. Si NO → REPORTADO, no SÉ
```

---

## 4. PARÁMETRO CALIBRADO ≠ PREDICCIÓN CONFIRMADA

### Ejemplos

```
CASO A (Calibración):
  Modelo: Y = a·X + b
  Se recopilan datos: X₁, Y₁, X₂, Y₂, ... X₁₀₀, Y₁₀₀
  Se ajustan parámetros: a = 2.3, b = 1.5 (minimizando error)
  Se anuncia: "¡Modelo predice Y con R²=0.98!"
  
  VEREDICTO: Es ajuste, no predicción. Los parámetros se eligieron
  para minimizar error EN LOS MISMOS DATOS. R²=0.98 es esperado.
  
  Para ser predicción: aplicar (a, b) a datos NUEVOS (no vistos en ajuste).

CASO B (Test set independiente):
  Modelo ajustado en: X₁-X₅₀, Y₁-Y₅₀
  Parámetros: a = 2.3, b = 1.5
  Test en datos nuevos: X₅₁-X₁₀₀, Y₅₁-Y₁₀₀
  R² en test = 0.94
  
  VEREDICTO: Es predicción validada (distinto conjunto de datos).
```

### Señal roja
- "Se ajustó el modelo a los datos y validó contra..." (MISMO dataset) → NO es predicción
- "Se predijo con un model fit sobre datos históricos" → si los datos históricos = test data, es tautología
- Confusión entre "fit" y "forecast"

---

## 5. CÓMO EVITAR TANDEO CIEGO TRAS ERROR

### Patrón: Buscar causa antes de reintentar

```
TANDEO CIEGO (costoso):
  Error: Script falla en línea 42
  Respuesta: "Intento v1, v2, v3, v4..." sin entender causa
  Resultado: 20 intentos, mismo error
  Tokens: 1000+ quemados

MÉTODO EFICIENTE:
  Error: Script falla en línea 42
  Paso 1: ¿Cuál era la precondición? (archivo existe? variable inicializa?)
  Paso 2: ¿Ocurrió ese error antes? (buscar en conversación, logs, docs)
  Paso 3: Si ocurrió, usar la solución previa sin reinventar
  Paso 4: Si no, entender causa (tipo de dato, permiso, API throttle?)
  Paso 5: UNA solución bien pensada, no 10 intentos

CHECKLIST:
  □ ¿Documenté ya la causa de este tipo de error?
  □ ¿Existe workaround conocido (sección 4 de PROTOCOLO_MIU, github issues)?
  □ ¿El error es plataforma-específico (Relay bug, GitHub API, Telegram parse_mode)?
  □ Si es nuevo, entiendo la causa fundamental?
  
  Solo después → intento una solución fundamentada
```

### Caso real (MIU-derivado):
```
ERROR: Telegram message falla con "TelegramError 400: Bad Request"
TANDEO CIEGO: Intenta con caracteres diferentes, formato diferente, etc.
MÉTODO: ¿Por qué 400?
  → Buscar: parse_mode Markdown con asteriscos sin escapar
  → Solución: usar parse_mode: "plain" o escapar caracteres
  → 1 intento, funciona
  vs
  → 5 intentos al azar, aún fallan
```

---

## 6. HONESTIDAD SOBRE BRECHAS

### Formato

```
INCORRECTO:
  "Se auditan 300 nodos" (sin documentar que solo 1 tiene verificación)
  "La predicción se confirmó" (sin archivo pre-data)
  "La métrica X es consistente" (sin mencionar casos donde falla)

CORRECTO:
  "Se auditan 300 nodos; 1 tiene DOI verificable (X). 299 pendientes."
  "No existe archivo de predicción pre-data; no es testeable."
  "Métrica X es consistente en 90% de casos; falla en microbioma y corales."
  
ESTRUCTURA:
  • SÉ: [hecho verificado con fuente hoy]
  • INFIERO: [deducción lógica clara sin prueba]
  • CONJETURO: [hipótesis sin datos]
  • NO SÉ: [ausente/no verificable/pendiente]
  • BRECHAS EXPLÍCITAS: [qué falta, no qué sobra]
```

### Beneficio
- Construcción de confianza (honestidad > perfección falsa)
- Evita sorpresas futuras ("yo creí que estaba validado")
- Guía a otros sobre dónde excavar

---

## 7. LÍMITES ESTADÍSTICOS COMUNES

```
N < 30:      "Muestra pequeña, no extrapolar"
N = 30-100:  "Significancia estadística es frágil, reportar CI"
N < 300:     "Correlaciones pueden ser espurias; buscar confunders"

r = 0.9+:    "Probablemente construcción, no relación causal"
             (a menos que sea modelo físico como F=ma)

p < 0.05:    "Significancia estadística, NO importancia práctica"
             (p-value es solo sobre ruido, no sobre efecto)

R² = 0.98:   "En training set? Probable overfitting. En test set? Excelente."
```

### Pregunta clave
"¿Cuántos puntos de datos independientes? ¿De dónde salieron?"

---

## 8. UNA PREGUNTA POR TURNO (MÁXIMO)

### Por qué

```
EFICIENTE:
  Q: "¿Tienes el archivo de predicción pre-data?"
  A: "Aquí está [link]"
  Siguiente: Una pregunta nueva, fundamentada en la respuesta

INEFICIENTE:
  Q: "¿Tienes predicción? ¿Cuándo fue? ¿Dónde? ¿Con qué formato? 
      ¿Quién la escribió? ¿Fue validada? ¿Cuántas veces?"
  A: "Sí/no" (sin saber cuál pregunta responde)
  Confusión, múltiples turnos para aclarar UNA pregunta
```

### Regla
- Una pregunta = una incógnita
- Después recibo respuesta, construcción siguiente pregunta sobre eso
- Ahorra turnos, acelera convergencia

---

## 9. ESCALAR DUDAS, NO INVENTAR

```
INVENTAR (caro):
  Pregunta: "¿Cuál es el K_i del nodo X?"
  Respuesta fabricada: "0.67 (estimado)"
  Daño: Decisiones sobre número falso
  Descubrimiento: 3 meses después → "ese número no existe"

ESCALAR (correcto):
  Pregunta: "¿Cuál es el K_i del nodo X?"
  Respuesta honesta: "No tengo dato. Opciones:
    A) Buscar en NUCLEO_TEORICO_MIU
    B) Pedir al dueño verificación
    C) Marcar como NO SÉ hasta tener fuente"
  Beneficio: Sin sorpresas, transparencia desde inicio
```

### Señales de alarma
- "Debería ser..." = inventando
- "Probablemente..." sin base = asumiendo
- "Según el patrón..." = extrapolando sin datos

---

## 10. PLATAFORMAS: GOTCHAS CONOCIDOS (SIN DATOS PERSONALES)

### Telegram
```
✗ parse_mode:"Markdown" + asteriscos sin escapar → Error 400
✓ Solución: parse_mode:"plain" o `**texto**` en HTML

✗ Mensajes > 4096 caracteres → se dividen automáticamente
✓ Enviar como múltiples mensajes si > 4096 chars
```

### GitHub
```
✗ PUT /repos/owner/repo/contents/file si archivo existe
  → requiere sha actual del archivo (GET previo)
✓ GET primero, extrae sha, luego PUT con sha en body

✗ GitHub Actions dispatch sin ref en body → error 422
✓ ref es requerido aunque no lo uses

✗ Assumir "repo tiene X archivos" → crear sin listar
✓ Listar SIEMPRE antes de escribir
```

### APIs genéricas
```
✗ "Me falta un token, lo asumo" → 401 Unauthorized
✓ Documentar dónde conseguirlo, generar si es posible

✗ "El archivo debe estar formateado así" (sin verificar)
✓ Leer actual primero, luego inferir formato

✗ Rate limits: "Haré 1000 requests" sin throttle
✓ Leer docs de rate limit, respetar, añadir backoff
```

---

## 11. RESUMEN EN UNA LÍNEA

```
ρ(x) > 0 | No fabricar | Detectar circularidad | 
SÉ|INFIERO|CONJETURO|NO SÉ | Parámetro ≠ predicción |
Congelar antes de datos | Brechas explícitas |
Buscar causa, no tantear | Una pregunta/turno | Honestidad
```

---

## 12. CUÁNDO CARGAR ESTO

**En cualquier sesión:**
- Auditar afirmación de "validación" o "predicción confirmada"
- Evaluar métricas en nuevo proyecto
- Diagnosticar error que repite
- Revisar claim de tercer o propio

**Contexto:**
- Sin datos personales ✓
- Sin Proyectos necesarios ✓
- Aplicable a cualquier dominio ✓
- Referencia rápida (no tutorial) ✓

---

**Versión:** 2026-07-04  
**Origen:** Validación MIU (aplicación generalizada)  
**Licencia:** Reutilizable, sin atribución obligatoria
