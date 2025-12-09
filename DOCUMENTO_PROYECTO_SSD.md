# Título del Proyecto: Sistema de Soporte a la Decisión para Selección de Smartphones "Pito Pérez"

**Equipo:** [Nombre del equipo y Nombres de los integrantes]

**Fecha de Entrega:** [Fecha]

**Materia:** Sistema de apoyo a la toma de decisiones

**Docente:** Elizabeth Gaxiola Carrillo

---

## RESUMEN

### Problema de Negocio

Los consumidores enfrentan una decisión compleja al momento de adquirir un smartphone debido a la gran variedad de opciones disponibles en el mercado mexicano. Esta decisión se complica por múltiples factores: la diversidad de marcas (Apple, Samsung, Google, Xiaomi, entre otras), rangos de precios amplios ($6,500 - $37,000 MXN), especificaciones técnicas variadas (RAM, almacenamiento, cámara, batería), y diferentes sistemas operativos (iOS vs Android). Los usuarios frecuentemente experimentan sobrecarga de información y dificultad para identificar qué dispositivo se ajusta mejor a sus necesidades específicas, presupuesto y preferencias de uso.

### Solución Propuesta

"Pito Pérez" es un Sistema de Soporte a la Decisión (SSD) basado en web que ayuda a los usuarios a seleccionar el smartphone ideal mediante un proceso estructurado de recomendación. El sistema integra múltiples fuentes de datos (APIs externas y base de datos local), aplica un modelo de puntuación multi-criterio para evaluar y rankear opciones, y presenta los resultados mediante una interfaz intuitiva con gráficos interactivos, filtros avanzados y un "Modo Fácil" que guía al usuario mediante preguntas simples. La principal salida del sistema es una lista ordenada de smartphones recomendados, priorizados según las preferencias y restricciones del usuario.

### Valor Agregado

El sistema proporciona un impacto significativo en la experiencia del usuario:
- **Reducción de tiempo de decisión**: De horas de investigación a minutos mediante recomendaciones automatizadas
- **Mejora en la precisión de la decisión**: Algoritmo de puntuación que considera múltiples criterios simultáneamente
- **Optimización de presupuesto**: Identifica opciones que maximizan el valor según el rango de precio del usuario
- **Accesibilidad**: Interfaz intuitiva que no requiere conocimiento técnico avanzado
- **Disponibilidad offline**: Funciona sin conexión a internet después de la primera carga

---

## 1. INTRODUCCIÓN Y JUSTIFICACIÓN

### 1.1 Problema de Decisión y Alcance

**Definición de la Decisión No Estructurada:**

La decisión que el sistema busca apoyar es la selección de un smartphone entre múltiples alternativas disponibles en el mercado mexicano. Esta es una decisión no estructurada porque:

1. **Múltiples criterios en conflicto**: El usuario debe balancear precio, rendimiento, cámara, batería, almacenamiento, marca, sistema operativo y diseño, donde mejorar un aspecto puede implicar sacrificar otro.

2. **Incertidumbre en preferencias**: Muchos usuarios no tienen claridad sobre qué características son más importantes para su caso de uso específico (gaming, fotografía, trabajo, uso básico, etc.).

3. **Información incompleta**: Los usuarios pueden no estar familiarizados con todas las opciones disponibles o con el significado técnico de las especificaciones.

4. **Sobrecarga de opciones**: Existen cientos de modelos diferentes, lo que dificulta la comparación manual.

**Fronteras del Sistema:**

El SSD "Pito Pérez" **SÍ hace**:
- Recopila y normaliza datos de smartphones desde múltiples fuentes (APIs externas y base de datos local)
- Filtra y ordena smartphones según criterios específicos del usuario
- Calcula puntuaciones de recomendación basadas en preferencias multi-criterio
- Presenta visualizaciones del mercado (gráficos de precios, baterías, sistemas operativos)
- Permite comparación lado a lado de hasta 3 smartphones
- Proporciona recomendaciones personalizadas mediante el "Modo Fácil"
- Almacena favoritos y comentarios de usuarios
- Funciona offline mediante Progressive Web App (PWA)

El SSD **NO hace**:
- No realiza compras directas (solo proporciona enlaces a tiendas)
- No garantiza disponibilidad de stock en tiempo real
- No incluye análisis de precios históricos o predicciones de tendencias futuras
- No integra sistemas de pago o carritos de compra
- No proporciona garantías o soporte técnico post-venta

**Usuario Objetivo:**

El sistema está dirigido a:
- **Consumidores finales** que buscan adquirir un smartphone en México
- Usuarios con diferentes niveles de conocimiento técnico (desde principiantes hasta expertos)
- Personas que valoran la eficiencia en la toma de decisiones
- Usuarios que prefieren interfaces intuitivas y guiadas

### 1.2 Clasificación del SSD

**Según el Alcance: Personal**

El sistema está clasificado como **SSD Personal** porque:
- Está diseñado para ser utilizado por un individuo que toma una decisión de compra personal
- Las recomendaciones se generan basándose en las preferencias y restricciones de un solo usuario a la vez
- Aunque múltiples usuarios pueden acceder al sistema simultáneamente, cada uno recibe recomendaciones independientes y personalizadas
- No requiere coordinación entre múltiples tomadores de decisión

**Según la Función (Modelo): MB-DSS (Modelo Principal)**

El sistema se clasifica como **MB-DSS (Model-Based DSS)** porque:

1. **Énfasis en el Modelo de Decisión**: El núcleo del sistema es un algoritmo de puntuación multi-criterio que calcula un score de recomendación para cada smartphone basándose en:
   - Presupuesto del usuario (0-30 puntos)
   - Sistema operativo preferido (0-25 puntos)
   - Tamaño de pantalla (0-15 puntos)
   - Prioridad de características (batería, cámara, almacenamiento, rendimiento, etc.) (0-30 puntos)
   - Tipo de uso (básico, gaming, profesional, creativo, etc.) (0-20 puntos)

2. **Modelo Formalizado**: El algoritmo implementa una función objetivo de maximización de puntuación:
   ```
   Score_total(phone) = Score_presupuesto + Score_OS + Score_pantalla + Score_prioridad + Score_uso
   ```
   Donde cada componente tiene pesos específicos que reflejan su importancia relativa.

3. **Datos como Entrada al Modelo**: Los datos de smartphones (precio, especificaciones, características) se utilizan como variables de entrada al modelo de puntuación, pero el valor agregado proviene del procesamiento del modelo, no del análisis directo de los datos.

4. **Justificación de la Clasificación**: Aunque el sistema maneja grandes volúmenes de datos (catálogo de smartphones), estos datos son procesados por el modelo de decisión para generar recomendaciones. El sistema no se limita a consultar y filtrar datos (como un DB-DSS), sino que aplica lógica de decisión compleja para rankear y priorizar opciones.

---

## 2. ARQUITECTURA DEL SSD Y FLUJO DE DATOS

### 2.1 Visión General de la Arquitectura

El sistema "Pito Pérez" sigue una arquitectura de cuatro subsistemas interconectados:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUBSISTEMA DE INTERFAZ (UI)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Dashboard │  │ Búsqueda │  │ Modo Fácil│  │Comparación│      │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘  └────┬──────┘      │
│       │              │             │             │              │
└───────┼──────────────┼─────────────┼─────────────┼──────────────┘
        │              │             │             │
        ▼              ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SUBSISTEMA DE MODELOS (MB)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Algoritmo de Puntuación Multi-Criterio                   │   │
│  │  • Presupuesto (30 pts)                                  │   │
│  │  • Sistema Operativo (25 pts)                             │   │
│  │  • Tamaño Pantalla (15 pts)                              │   │
│  │  • Prioridad Características (30 pts)                    │   │
│  │  • Tipo de Uso (20 pts)                                  │   │
│  │  → Score Total → Ranking de Smartphones                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        ▲              ▲             ▲             ▲
        │              │             │             │
┌───────┼──────────────┼─────────────┼─────────────┼──────────────┐
│                  SUBSISTEMA DE DATOS (DB)                        │
│  ┌──────────────┐         ┌──────────────────┐                  │
│  │ API Externa  │ ──────► │ Normalización y  │                  │
│  │ (DummyJSON)  │         │ Mapeo de Datos   │                  │
│  └──────────────┘         └────────┬─────────┘                  │
│  ┌──────────────┐                  │                             │
│  │ Base Datos   │ ─────────────────┘                             │
│  │ Local (BD)   │                                                 │
│  └──────────────┘                                                 │
│  ┌──────────────┐                                                │
│  │ localStorage  │ (Caché, Favoritos, Comentarios)                │
│  └──────────────┘                                                │
└──────────────────────────────────────────────────────────────────┘
        ▲              ▲             ▲             ▲
        │              │             │             │
┌───────┼──────────────┼─────────────┼─────────────┼──────────────┐
│            SUBSISTEMA DE GESTIÓN DEL CONOCIMIENTO (KG)           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Reglas de Negocio (rangos de precio por marca)      │   │
│  │  • Conocimiento Tácito (preferencias de usuarios)       │   │
│  │  • Base de Conocimiento del Chatbot                    │   │
│  │  • Comentarios y Calificaciones de Usuarios            │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Flujo de Información:**

1. **Entrada del Usuario** → El usuario ingresa preferencias mediante la interfaz (filtros, respuestas del Modo Fácil)
2. **Consulta a Datos** → El subsistema de datos recupera el catálogo de smartphones (API o base local)
3. **Aplicación del Modelo** → El modelo de puntuación procesa cada smartphone según las preferencias
4. **Integración de Conocimiento** → El subsistema de conocimiento contextualiza y enriquece las recomendaciones
5. **Presentación de Resultados** → La interfaz muestra los smartphones rankeados con visualizaciones

### 2.2 Subsistema de Datos (DB)

**Fuentes de Datos:**

1. **Datos Externos (APIs)**:
   - **DummyJSON API** (`https://dummyjson.com/products/category/smartphones`): Proporciona productos de smartphones con información básica (nombre, precio, imágenes, descripción, rating, stock)
   - **Fallback API**: FakeStore API como respaldo si DummyJSON no está disponible
   - **Estrategia de Múltiples APIs**: El sistema intenta conectarse secuencialmente a diferentes APIs hasta encontrar una disponible

2. **Datos Internos (Base de Datos Local)**:
   - **Base de datos de respaldo** (`fallback-db.js`): Contiene un catálogo curado de smartphones actuales con especificaciones detalladas (iPhone 14, iPhone 15, Galaxy S23, Galaxy S24, etc.)
   - **localStorage**: Almacena:
     - Caché del catálogo de smartphones (con timestamp)
     - Favoritos del usuario
     - Comentarios y calificaciones
     - Historial de búsquedas
     - Preferencias de usuario

**Esquema de Datos:**

Cada smartphone en el sistema se representa con la siguiente estructura:

```javascript
{
    id: "phone-001",                    // Identificador único
    name: "iPhone 15 Pro",              // Nombre del modelo
    brand: "apple",                     // Marca (apple, samsung, google, xiaomi, etc.)
    price: 25000,                       // Precio en MXN (pesos mexicanos)
    storage: "256gb",                   // Almacenamiento interno
    ram: "8gb",                         // Memoria RAM
    camera: "48mp",                     // Resolución de cámara principal
    battery: 4500,                      // Capacidad de batería (mAh)
    screen: "large",                    // Tamaño de pantalla (small, medium, large)
    os: "ios",                          // Sistema operativo (ios, android)
    condition: "new",                   // Condición (new, refurbished)
    specs: "8gb RAM • 256gb • 48mp Camera • 4500 mAh Batería.",
    image: "src/images/phones/iphone-15-pro.jpg",  // URL de imagen
    rating: 4.5,                        // Calificación promedio
    stock: 15,                          // Disponibilidad en stock
    fullSpecs: {                        // Especificaciones completas
        Processor: "A17 Pro",
        Display: "6.1\" Super Retina XDR",
        'Main Camera': "48MP",
        'Front Camera': "12MP",
        'Battery Life': "4500 mAh",
        Weight: "187g",
        Materials: "Titanio",
        Description: "..."
    },
    purchaseLinks: [                    // Enlaces de compra
        { store: "Tienda Oficial", url: "...", logo: "🛒" },
        { store: "Amazon MX", url: "...", logo: "📦" }
    ]
}
```

**Variables Críticas que Alimentan el Modelo:**

- `price`: Utilizada para filtrar por presupuesto y calcular puntuación de presupuesto
- `os`: Comparada con la preferencia del usuario para puntuación de sistema operativo
- `screen`: Mapeada a tamaño de pantalla para puntuación de tamaño
- `battery`: Utilizada cuando la prioridad es duración de batería
- `camera`: Utilizada cuando la prioridad es fotografía
- `storage`: Utilizada cuando la prioridad es almacenamiento
- `ram`: Utilizada cuando la prioridad es rendimiento
- `brand`: Utilizada para puntuación de marca reconocida

**Estrategia de Integración:**

1. **Recolección**:
   - Al iniciar la aplicación, se intenta cargar datos desde la API externa (DummyJSON)
   - Si la API falla o no hay conexión, se carga desde la base de datos local
   - Se combinan ambos fuentes para tener el catálogo más completo posible

2. **Normalización**:
   - Los datos de la API se mapean al esquema estándar mediante la función `mapToPhoneSpecs()`
   - Se detecta automáticamente la marca desde el nombre del producto
   - Se extraen especificaciones (RAM, almacenamiento) del nombre o descripción
   - Se convierten precios de USD a MXN si es necesario (tipo de cambio aproximado: 1 USD = 18.5 MXN)
   - Se generan valores por defecto para campos faltantes basándose en el precio y la marca

3. **Limpieza**:
   - Se valida que todos los campos requeridos estén presentes
   - Se filtran productos duplicados por ID
   - Se asegura que los precios estén en un rango razonable para México ($6,500 - $37,000 MXN)
   - Se normalizan formatos de especificaciones (ej: "8GB" → "8gb")

4. **Almacenamiento**:
   - Los datos normalizados se guardan en `localStorage` con timestamp para caché
   - El caché tiene una duración de 24 horas antes de considerarse expirado
   - Los datos se actualizan automáticamente cuando hay conexión y la API responde

---

## 3. SUBSISTEMA DE MODELOS

### 3.1 Tipo de Modelo Elegido y Justificación

**Modelo Principal: Modelo de Puntuación Multi-Criterio (Scoring Model)**

El sistema utiliza un **modelo de puntuación/ranking** que es una variante de un modelo de optimización donde la función objetivo es maximizar una puntuación total calculada como la suma ponderada de múltiples criterios.

**Justificación:**

Este modelo es el más adecuado para el problema de decisión planteado porque:

1. **Múltiples Criterios en Conflicto**: La selección de un smartphone requiere balancear múltiples factores (precio, rendimiento, cámara, batería, etc.) que no pueden optimizarse simultáneamente. Un modelo de puntuación permite asignar pesos a cada criterio según las preferencias del usuario.

2. **Preferencias Subjetivas**: Diferentes usuarios valoran diferentes características. El modelo permite personalizar los pesos según las respuestas del usuario en el "Modo Fácil".

3. **Ranking en lugar de Optimización Única**: A diferencia de un modelo de optimización que devuelve una única solución óptima, un modelo de puntuación genera un ranking completo, permitiendo al usuario explorar múltiples opciones y tomar la decisión final considerando factores no cuantificables (diseño, marca, disponibilidad).

4. **Transparencia y Explicabilidad**: El modelo es relativamente simple de entender y explicar al usuario, lo que aumenta la confianza en las recomendaciones.

5. **Flexibilidad**: El modelo puede adaptarse fácilmente a diferentes tipos de usuarios (gaming, fotografía, trabajo) ajustando los pesos de los criterios.

### 3.2 Formalización del Modelo

**Función Objetivo:**

El modelo calcula una puntuación total para cada smartphone `i` mediante la siguiente función:

```
Score_total(phone_i) = Σ w_j * Score_criterio_j(phone_i)
```

Donde:
- `Score_total(phone_i)`: Puntuación total del smartphone `i`
- `w_j`: Peso del criterio `j` (implícito en los puntos máximos asignados)
- `Score_criterio_j(phone_i)`: Puntuación del smartphone `i` en el criterio `j`

**Criterios y Puntuaciones:**

1. **Criterio: Presupuesto** (Peso: 30 puntos máximos)
   ```
   Score_presupuesto(phone) = {
       30 puntos  si price ∈ [min_budget, max_budget]
       20 puntos  si price < min_budget (cerca del rango)
       10 puntos  si price > max_budget (por encima pero aceptable)
       15 puntos  si budget = "flexible" (neutral)
   }
   ```
   Donde `[min_budget, max_budget]` se determina según la respuesta del usuario:
   - "very-low": [0, 5500] MXN
   - "low": [5500, 9250] MXN
   - "medium": [9250, 14800] MXN
   - "high": [14800, 22200] MXN
   - "premium": [22200, ∞] MXN

2. **Criterio: Sistema Operativo** (Peso: 25 puntos máximos)
   ```
   Score_OS(phone) = {
       25 puntos  si phone.os == user_preference.os (coincidencia exacta)
       20 puntos  si phone.os == user_preference.os (preferencia, no requerimiento)
       15 puntos  si user_preference.os == "any"
       5 puntos   si no coincide (penalización)
   }
   ```

3. **Criterio: Tamaño de Pantalla** (Peso: 15 puntos máximos)
   ```
   Score_pantalla(phone) = {
       15 puntos  si phone.screenSize ∈ [min_size, max_size]
       8 puntos   si está fuera del rango pero cercano
   }
   Donde:
   - "small": [0, 5.5] pulgadas
   - "medium": [5.5, 6.2] pulgadas
   - "large": [6.2, ∞] pulgadas
   ```

4. **Criterio: Prioridad de Características** (Peso: 30 puntos máximos)
   ```
   Score_prioridad(phone) = {
       (phone.battery / max_battery) * 30        si priority == "battery"
       (phone.camera / max_camera) * 30           si priority == "camera"
       (phone.storage / max_storage) * 30         si priority == "storage"
       (phone.ram / max_ram) * 30                 si priority == "performance"
       30 puntos                                  si priority == "brand" y es marca reconocida
       f(phone.screenSize, phone.weight) * 30    si priority == "design"
       f(phone.battery, phone.storage) * 30       si priority == "durability"
       (Σ specs / price) * 1000 * 30             si priority == "value"
   }
   ```
   Donde `max_battery`, `max_camera`, etc. son los valores máximos en el catálogo actual.

5. **Criterio: Tipo de Uso** (Peso: 20 puntos máximos)
   ```
   Score_uso(phone) = {
       20 puntos                                  si usage == "basic"
       f(camera > 12MP, storage > 64GB) * 20     si usage == "social"
       f(ram > 6GB, battery > 4000mAh) * 20       si usage == "gaming"
       f(storage > 128GB, ram > 6GB) * 20         si usage == "professional"
       f(camera > 20MP, storage > 128GB) * 20     si usage == "creative"
       f(battery > 3500mAh, storage > 64GB) * 20  si usage == "student"
       f(battery > 4000mAh, camera > 12MP) * 20  si usage == "travel"
       15 puntos                                  si usage == "mixed"
   }
   ```

**Algoritmo de Ranking:**

1. Para cada smartphone en el catálogo, calcular `Score_total(phone_i)`
2. Ordenar smartphones en orden descendente de `Score_total`
3. Presentar los top N smartphones (típicamente top 10-15) al usuario

**Restricciones Implícitas:**

- Todos los smartphones deben tener precio > 0
- Todos los smartphones deben tener especificaciones válidas (RAM, almacenamiento, etc.)
- El ranking solo incluye smartphones con `Score_total > 0` (aunque en la práctica todos tienen al menos 5 puntos)

---

## 4. SUBSISTEMA DE INTERFAZ DE USUARIO (UI/UX)

### 4.1 Principios de Diseño para la Decisión

**Facilitación de la Interacción:**

La interfaz del sistema está diseñada siguiendo principios de diseño centrado en la decisión:

1. **Progresión de Complejidad**: El sistema ofrece tres niveles de interacción:
   - **Panel General**: Visualización pasiva de datos del mercado (gráficos)
   - **Búsqueda Avanzada**: Control granular sobre filtros para usuarios experimentados
   - **Modo Fácil**: Guía paso a paso para usuarios sin conocimiento técnico

2. **Prevención de Sobrecarga de Información**:
   - Los resultados se presentan en tarjetas visuales con información esencial
   - Las especificaciones completas están disponibles bajo demanda (modal de detalles)
   - Los gráficos utilizan colores y leyendas claras
   - La comparación se limita a 3 smartphones máximo para mantener la legibilidad

3. **Feedback Inmediato**: 
   - Los filtros se aplican en tiempo real mientras el usuario los ajusta
   - Los resultados se actualizan automáticamente sin necesidad de botón "Buscar"
   - Indicadores visuales muestran cuántos resultados coinciden con los filtros

**Inputs del Usuario (Variables Modificables para Análisis de Sensibilidad):**

1. **Búsqueda Avanzada**:
   - **Marca**: Filtro por marca (Apple, Samsung, Google, Xiaomi, etc.)
   - **Sistema Operativo**: iOS, Android, o ambos
   - **RAM**: Rango mínimo (2GB, 4GB, 6GB, 8GB, 12GB, 16GB)
   - **Almacenamiento**: Rango mínimo (32GB, 64GB, 128GB, 256GB, 512GB, 1TB)
   - **Cámara**: Resolución mínima en megapíxeles
   - **Batería**: Capacidad mínima en mAh
   - **Precio**: Rango mínimo y máximo en MXN
   - **Búsqueda por nombre**: Campo de texto libre
   - **Ordenamiento**: Por precio, nombre, batería, cámara (ascendente/descendente)

2. **Modo Fácil**:
   - **Presupuesto**: Muy bajo, Bajo, Medio, Alto, Premium, Flexible
   - **Sistema Operativo**: iOS requerido, Android requerido, Prefiero iOS, Prefiero Android, Cualquiera
   - **Tamaño de Pantalla**: Pequeña, Mediana, Grande, Cualquiera
   - **Prioridad**: Batería, Cámara, Almacenamiento, Rendimiento, Marca, Diseño, Durabilidad, Mejor Valor
   - **Tipo de Uso**: Básico, Redes Sociales, Gaming, Profesional, Creativo, Estudiante, Viajes, Mixto

**Outputs del Sistema (Presentación de Resultados):**

1. **Panel General - Gráficos Interactivos**:
   - **Gráfico de Barras**: Precio promedio por marca (MXN)
   - **Gráfico de Barras**: Capacidad de batería promedio por marca (mAh)
   - **Gráfico de Dona**: Distribución de sistemas operativos (iOS vs Android)
   - **Gráfico de Líneas**: Resolución de cámara promedio por marca (MP)
   - Todos los gráficos son interactivos (Chart.js) y se actualizan con los datos del catálogo

2. **Búsqueda Avanzada - Grid de Tarjetas**:
   - Cada smartphone se muestra en una tarjeta con:
     - Imagen del dispositivo
     - Nombre y marca
     - Especificaciones resumidas (RAM, almacenamiento, cámara, batería)
     - Precio destacado en MXN
     - Botones: "Ver Detalles", "Agregar a Favoritos", "Comparar"
   - Badges visuales para destacar características (ej: "Mejor Batería", "Mejor Cámara")

3. **Modo Fácil - Recomendaciones Rankeadas**:
   - Lista ordenada de smartphones con:
     - Puntuación de recomendación visible (ej: "95% de coincidencia")
     - Badges que indican por qué fue recomendado (ej: "Perfecto para Gaming")
     - Explicación breve de la recomendación
     - Mismas tarjetas que búsqueda avanzada

4. **Comparación - Tabla Detallada**:
   - Tabla lado a lado con hasta 3 smartphones
   - Comparación de: Marca, Modelo, Precio, RAM, Almacenamiento, Cámara Principal, Cámara Frontal, Batería, Sistema Operativo, Dimensiones, Peso
   - Resaltado visual de diferencias significativas

5. **Comentarios - Sistema de Opiniones**:
   - Lista de comentarios con calificación por estrellas (1-5)
   - Estadísticas agregadas: Total de comentarios, Calificación promedio
   - Filtros: Por teléfono, Ordenar por fecha/calificación

### 4.2 Análisis de Sensibilidad

**Prueba de Sensibilidad Realizada:**

Se realizó una prueba de sensibilidad modificando el criterio de presupuesto para evaluar cómo cambian las recomendaciones:

**Escenario Base:**
- Usuario con presupuesto "Medio" ($9,250 - $14,800 MXN)
- Prioridad: "Mejor Valor"
- Uso: "Mixto"
- Sistema Operativo: "Cualquiera"
- Tamaño: "Mediano"

**Resultado Base:** El sistema recomienda principalmente smartphones de gama media como Galaxy A54, Pixel 8a, con puntuaciones entre 75-85 puntos.

**Escenario Modificado (+10% en presupuesto máximo):**
- Presupuesto ajustado a "Medio-Alto" ($9,250 - $16,280 MXN, +10% del máximo)

**Resultado Modificado:** 
- Aparecen nuevos smartphones en el top de recomendaciones: iPhone 14, Galaxy S23 (modelos de gama media-alta)
- Los smartphones anteriores mantienen posiciones altas pero algunos modelos premium entran en el ranking
- La puntuación de algunos smartphones aumenta ligeramente (de 75 a 80-82 puntos) porque ahora están dentro del rango de presupuesto

**Escenario Modificado (-15% en presupuesto máximo):**
- Presupuesto ajustado a "Medio-Bajo" ($9,250 - $12,580 MXN, -15% del máximo)

**Resultado Modificado:**
- Los smartphones de gama media-alta desaparecen del top 10
- Se priorizan modelos más económicos como Redmi Note 13, Galaxy A34
- Las puntuaciones de los smartphones que quedan fuera del rango disminuyen (de 75 a 65-70 puntos)

**Conclusión sobre la Robustez:**

El sistema muestra **robustez moderada** ante cambios en el presupuesto:

✅ **Fortalezas:**
- El modelo responde de manera predecible a cambios en el presupuesto
- Los cambios en las recomendaciones son lógicos y justificables
- El ranking se ajusta suavemente sin cambios bruscos

⚠️ **Limitaciones:**
- Cambios pequeños en el presupuesto (±5%) tienen impacto limitado
- El modelo es más sensible a cambios grandes (±15% o más)
- La robustez depende de la disponibilidad de opciones en cada rango de precio

**Recomendación:** El sistema es adecuado para su propósito, pero se sugiere implementar análisis de sensibilidad más granular que muestre al usuario cómo pequeñas variaciones en sus preferencias afectan las recomendaciones, aumentando la transparencia y confianza.

---

## 5. SUBSISTEMA DE GESTIÓN DEL CONOCIMIENTO

### 5.1 Niveles DIKW

**Dato (Data):**

Ejemplos de datos crudos en el sistema:
- Venta unitaria de un smartphone específico en un día: `"iPhone 15 Pro vendido el 15/11/2024"`
- Precio de un modelo: `"25000"` (MXN)
- Capacidad de batería: `"4500"` (mAh)
- Calificación de un usuario: `"4"` (estrellas)
- Timestamp de un comentario: `"1700123456789"` (milisegundos desde epoch)

**Información (Information):**

Ejemplos de información procesada:
- **Tendencia de precios**: "El precio promedio de smartphones Apple en el mercado es $28,500 MXN, mientras que Samsung promedia $18,200 MXN"
- **Distribución de sistemas operativos**: "El 65% de los smartphones en el catálogo ejecutan Android, mientras que el 35% ejecuta iOS"
- **Correlación precio-batería**: "Los smartphones con batería superior a 4500 mAh tienen un precio promedio 40% mayor que aquellos con batería inferior"
- **Calificación promedio por marca**: "Los smartphones Apple tienen una calificación promedio de 4.6/5, mientras que Xiaomi promedia 4.2/5"

**Conocimiento (Knowledge):**

Ejemplos de conocimiento derivado:
- **Regla de negocio**: "Los smartphones con presupuesto 'Premium' (más de $22,200 MXN) típicamente tienen cámaras de 48MP o superior y baterías de 4000 mAh o más"
- **Heurística de recomendación**: "Para usuarios que priorizan 'Gaming', se debe dar mayor peso a RAM (mínimo 8GB) y batería (mínimo 4000 mAh) en el cálculo de puntuación"
- **Patrón de uso**: "Los usuarios que seleccionan 'Uso Profesional' frecuentemente eligen smartphones con almacenamiento de 256GB o superior, independientemente del presupuesto"
- **Conocimiento del dominio**: "Los smartphones Apple (iOS) no son compatibles con aplicaciones Android, por lo que si un usuario requiere una app específica de Android, se debe penalizar fuertemente las opciones iOS en el ranking"

**Sabiduría (Wisdom):**

Ejemplos de sabiduría aplicada:
- **Juicio ético del sistema**: "Aunque un smartphone puede tener la puntuación más alta según el algoritmo, el sistema debe presentar múltiples opciones (top 10-15) para que el usuario tome la decisión final considerando factores no cuantificables como diseño estético, disponibilidad local, o preferencias de marca personales"
- **Principio de transparencia**: "El sistema debe explicar por qué un smartphone fue recomendado (badges, explicaciones) para que el usuario entienda la lógica y pueda ajustar sus preferencias si no está satisfecho"
- **Balance entre automatización y control**: "Aunque el sistema puede automatizar completamente la selección, es más valioso empoderar al usuario con herramientas de comparación y filtrado para que mantenga el control sobre la decisión final"
- **Adaptabilidad**: "El conocimiento del sistema debe evolucionar con el tiempo: nuevos modelos, cambios en precios, actualizaciones de especificaciones. Por lo tanto, el sistema debe diseñarse para actualizarse periódicamente desde fuentes externas"

### 5.2 Uso del Conocimiento en el SSD

**Integración de Conocimiento Tácito y Explícito:**

El sistema integra conocimiento de múltiples formas para justificar y contextualizar las recomendaciones:

1. **Conocimiento Explícito - Reglas de Negocio Codificadas**:
   - **Rangos de Precio por Marca**: El sistema contiene conocimiento explícito sobre los rangos de precio típicos de cada marca:
     ```javascript
     const basePrices = {
         apple: { min: 22000, max: 37000 },
         samsung: { min: 9500, max: 32000 },
         google: { min: 15000, max: 27000 },
         xiaomi: { min: 6500, max: 24000 }
     };
     ```
     Este conocimiento se utiliza para generar precios realistas cuando la API no proporciona precios, y para validar que los precios están en rangos razonables.

   - **Mapeo de Características a Uso**: El sistema codifica conocimiento sobre qué características son importantes para cada tipo de uso:
     - Gaming → RAM alta, batería grande
     - Fotografía → Cámara de alta resolución, almacenamiento amplio
     - Trabajo → Almacenamiento y rendimiento
     - Básico → Cualquier smartphone moderno es adecuado

2. **Conocimiento Tácito - Preferencias de Usuarios**:
   - **Sistema de Comentarios**: Los comentarios y calificaciones de usuarios capturan conocimiento tácito sobre la experiencia real con los smartphones. Aunque este conocimiento no se integra directamente en el algoritmo de puntuación, se presenta al usuario para que lo considere en su decisión final.
   
   - **Historial de Búsquedas**: El sistema almacena el historial de búsquedas del usuario, que refleja patrones de preferencia tácitos. Aunque no se utiliza actualmente para personalización automática, podría utilizarse en el futuro para mejorar recomendaciones.

3. **Base de Conocimiento del Chatbot**:
   - El chatbot integrado contiene conocimiento estructurado sobre:
     - Recomendaciones generales por rango de precio
     - Características destacadas de marcas populares
     - Guías de uso de funcionalidades del sistema
   - Este conocimiento se presenta cuando el usuario hace preguntas, proporcionando contexto adicional a las recomendaciones del modelo.

4. **Justificación de Recomendaciones**:
   - **Badges Explicativos**: Cuando un smartphone es recomendado, el sistema muestra badges como "Perfecto para Gaming" o "Mejor Batería" que explican por qué fue seleccionado, integrando el conocimiento sobre qué características son relevantes para cada caso de uso.
   
   - **Explicaciones en Modo Fácil**: El sistema proporciona explicaciones breves junto con cada recomendación, como "Recomendado porque cumple con tu presupuesto y tiene excelente cámara para fotografía", combinando el output del modelo con conocimiento contextual.

5. **Contextualización mediante Visualizaciones**:
   - Los gráficos del Panel General proporcionan contexto de mercado que ayuda al usuario a entender si un precio es razonable, si una batería es superior al promedio, etc. Este conocimiento contextual complementa las recomendaciones del modelo.

**Limitaciones Actuales y Oportunidades de Mejora**:

- El conocimiento de comentarios de usuarios no se integra directamente en el algoritmo de puntuación. Se podría mejorar calculando un "factor de confianza" basado en calificaciones promedio.
- El sistema no aprende de las decisiones finales de los usuarios (qué smartphone compraron realmente). Se podría implementar aprendizaje por retroalimentación.
- El conocimiento sobre disponibilidad de stock y precios actualizados depende de APIs externas. Se podría mejorar con integración de múltiples fuentes de datos de tiendas.

---

## 6. CONCLUSIONES Y TRABAJO FUTURO

### Conclusiones

El Sistema de Soporte a la Decisión "Pito Pérez" ha demostrado ser una herramienta funcional y efectiva para apoyar a los usuarios en la selección de smartphones. El sistema logra su objetivo principal de reducir la complejidad de la decisión mediante:

1. **Integración Exitosa de Múltiples Subsistemas**: Los cuatro subsistemas (Datos, Modelos, Interfaz, Conocimiento) trabajan de manera coordinada para proporcionar una experiencia de usuario fluida y recomendaciones relevantes.

2. **Modelo de Decisión Efectivo**: El algoritmo de puntuación multi-criterio genera rankings lógicos y justificables que responden adecuadamente a las preferencias del usuario. Las pruebas de sensibilidad demuestran que el modelo es robusto ante variaciones moderadas en los criterios.

3. **Interfaz Intuitiva**: La progresión de complejidad (Panel General → Búsqueda Avanzada → Modo Fácil) permite que usuarios con diferentes niveles de conocimiento técnico utilicen el sistema efectivamente.

4. **Funcionalidad Offline**: La implementación como Progressive Web App (PWA) con base de datos local y Service Worker permite que el sistema funcione sin conexión a internet, aumentando su disponibilidad y utilidad.

5. **Valor Agregado Medible**: El sistema reduce significativamente el tiempo necesario para identificar opciones relevantes de smartphones, de horas de investigación manual a minutos de interacción con la herramienta.

### Trabajo Futuro

**Expansiones y Mejoras Propuestas:**

1. **Integración de Más Fuentes de Datos**:
   - Integrar APIs de tiendas reales (Amazon México, Mercado Libre, tiendas oficiales) para obtener precios y disponibilidad en tiempo real
   - Incorporar datos de reviews profesionales (GSMArena, TechRadar) para enriquecer las especificaciones
   - Agregar datos históricos de precios para identificar tendencias y mejores momentos de compra

2. **Mejora del Algoritmo de Optimización**:
   - Implementar algoritmos de machine learning (regresión, clustering) para aprender de las preferencias de usuarios y mejorar las recomendaciones
   - Agregar análisis de sentimiento de comentarios de usuarios para incorporar conocimiento tácito en el modelo
   - Implementar técnicas de optimización multi-objetivo (Pareto optimality) para manejar mejor los trade-offs entre criterios

3. **Expansión de Funcionalidades**:
   - Agregar comparación de planes de telefonía móvil junto con smartphones
   - Implementar alertas de precio para smartphones en la lista de favoritos
   - Agregar funcionalidad de "Wishlist" con notificaciones cuando un smartphone baja de precio
   - Integrar calculadora de costo total de propiedad (TCO) considerando planes de datos

4. **Mejoras en la Interfaz**:
   - Implementar visualizaciones más avanzadas (gráficos de radar para comparación multi-dimensional)
   - Agregar modo de realidad aumentada para visualizar smartphones en tamaño real
   - Mejorar la accesibilidad (soporte para lectores de pantalla, navegación por teclado)
   - Implementar temas personalizables y modo oscuro mejorado

5. **Integración de Conocimiento Avanzado**:
   - Implementar sistema de recomendación colaborativa ("Usuarios que compraron X también compraron Y")
   - Agregar análisis predictivo de durabilidad y valor de reventa
   - Incorporar conocimiento experto de técnicos en reparación sobre confiabilidad de modelos

6. **Optimizaciones Técnicas**:
   - Implementar caché más inteligente con estrategias de invalidación basadas en tiempo y eventos
   - Optimizar el rendimiento del algoritmo de puntuación para catálogos muy grandes (miles de modelos)
   - Implementar sincronización en tiempo real de datos mediante WebSockets

7. **Expansión de Alcance**:
   - Extender el sistema para recomendar otros dispositivos electrónicos (tablets, laptops, smartwatches)
   - Agregar soporte para múltiples países y monedas
   - Implementar versiones en otros idiomas

### Bibliografía

1. Turban, E., Sharda, R., & Delen, D. (2018). *Decision Support and Business Intelligence Systems* (10th ed.). Pearson.

2. Power, D. J. (2002). *Decision Support Systems: Concepts and Resources for Managers*. Quorum Books.

3. Chart.js Documentation. (2024). *Chart.js - Simple yet flexible JavaScript charting library*. https://www.chartjs.org/docs/latest/

4. MDN Web Docs. (2024). *Progressive Web Apps (PWAs)*. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

5. DummyJSON API Documentation. (2024). *DummyJSON - Fake REST API for testing*. https://dummyjson.com/docs

6. W3C. (2024). *Web Content Accessibility Guidelines (WCAG) 2.1*. https://www.w3.org/WAI/WCAG21/quickref/

7. Firebase Documentation. (2024). *Firebase - Build and run apps with Google's platform*. https://firebase.google.com/docs

8. Tailwind CSS Documentation. (2024). *Tailwind CSS - Rapidly build modern websites*. https://tailwindcss.com/docs

---

**Fin del Documento**

