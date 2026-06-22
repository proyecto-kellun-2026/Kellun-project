## Why

Permite a los voluntarios encontrar rápidamente voluntariados de su interés según la temática o tipo de actividad (por ejemplo: animales, limpieza, ayuda a personas de la tercera edad), evitando que tengan que buscar entre todos los registros de forma manual y mejorando la experiencia de usuario.

## What Changes

- Creación de una interfaz de búsqueda y filtrado por tipo en el frontend.
- Creación de un endpoint API para obtener de forma dinámica los tipos únicos de voluntariado disponibles en el sistema.
- Refactorización de la lógica del backend para separar la lógica de negocio en capas `routes/`, `controllers/` y `services/` (específicamente para voluntariados).
- Integración de los filtros dinámicos en la UI de búsqueda del voluntario.

## Capabilities

### New Capabilities
- `filtrar-voluntariados-tipo`: Permitir a los usuarios seleccionar un tipo de voluntariado obtenido de forma dinámica y filtrar el listado de voluntariados activos en base a este.

### Modified Capabilities
