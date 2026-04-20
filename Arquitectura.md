## 1. Estilo Arquitectónico

Estilo adoptado: [nombre del estilo, ej: Cliente-Servidor, Capas, etc.]

Justificación basada en REF priorizados:

| REF ID | Descripción                              | Prioridad | Cómo lo aborda el estilo      |
|--------|------------------------------------------|-----------|-------------------------------|
| REF-01 | [descripción]                            | Alta      | [explicación]                 |
| REF-02 | [descripción]                            | Alta      | [explicación]                 |

### Justificación

Para el proyecto se selecciono una arquitectura Cliente-Servidor. La idea principal es abordar toda la lógica de negocio en una API robusta. Esta decisión permite garantizar una disponibilidad del 98% mediante infraestructura en la nube y asegurar un rendimiento de navegación menor a 1 segundo al descargar el procesamiento pesado del dispositivo móvil.

Este modelo facilita la escalabilidad para 1000 usuarios al permitir el crecimiento horizontal del backend sin afectar la aplicación instalada. Sin embargo, se asume una dependencia total de la conexión a internet, sacrificando la funcionalidad offline en favor de la sincronización de eventos en tiempo real y una menor complejidad operativa para nuestro equipo

## 2. Diagrama de Arquitectura

[Insertar diagrama que muestre el estilo y los módulos.
Ejemplo: ![Diagrama de Arquitectura](./diagrama_arquitectura.png)]

## 3. Descomposición Modular

Fundamentación: [Criterio de descomposición: por dominio, capa, funcionalidad, etc.]

### Módulo 1: [Nombre]
- Responsabilidad: [qué hace este módulo]
- Ofrece a otros módulos: [interfaces o datos que expone]
- Depende de: [módulos de los que consume servicios]

### Módulo 2: [Nombre]
- Responsabilidad: [qué hace este módulo]
- Ofrece a otros módulos: [interfaces o datos que expone]
- Depende de: [módulos de los que consume servicios]

### Módulo N: [Nombre]
- Responsabilidad: ...
- Ofrece a otros módulos: ...
- Depende de: ...

## 4. Decisiones de Diseño

### Decisión 1
- Decisión: [qué se decide]
- Motivación: [por qué, referenciando REF si aplica]
- Alternativas consideradas: [qué otras opciones se evaluaron]
- Impacto: [en qué módulos o REF afecta]
