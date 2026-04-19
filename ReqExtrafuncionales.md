## Catálogo de Requisitos Extrafuncionales

Clasificación según ISO 25010 y tipo de restricción.
La columna Prioridad refleja la importancia para las decisiones de arquitectura:
Alta, Media o Baja.

| ID     | Tipo                        | Descripción                                                                   | Prioridad                 |
| ------ | --------------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| REF-01 | Calidad de servicio (Disp.) | El sistema debe garantizar una alta disponibilidad (ej. 99.9% de uptime).     | :red_circle: **Alta**     |
| REF-02 | Calidad de servicio (Seg.)  | Implementación de medidas de seguridad básicas para proteger datos sensibles. | :orange_circle: **Media** |
| REF-03 | Calidad de servicio (Perf.) | El tiempo de respuesta de las peticiones no debe superar los 5 segundos.      | :green_circle: **Baja**   |
| REF-04 | Restricción técnica         | La aplicación debe de funcionar en sistemas Android y iOS                     | :orange_circle: **Media** |
| REF-05 |                             |                                                                               |                           |
| REF-06 |                             |                                                                               |                           |
| REF-07 |                             |                                                                               |                           |

> Nota: Los requisitos de prioridad Alta deben quedar explícitamente
> abordados en las decisiones de diseño arquitectónico.
