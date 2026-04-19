## 1. Estilo Arquitectónico

Estilo adoptado: [nombre del estilo, ej: Cliente-Servidor, Capas, etc.]

Justificación basada en REF priorizados:

| REF ID | Descripción                              | Prioridad | Cómo lo aborda el estilo      |
|--------|------------------------------------------|-----------|-------------------------------|
| REF-01 | [descripción]                            | Alta      | [explicación]                 |
| REF-02 | [descripción]                            | Alta      | [explicación]                 |

Explicación textual: [Describir por qué el estilo elegido es el más adecuado
considerando los REF de alta prioridad. Ningún REF de alta prioridad puede
quedar sin ser abordado.]

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