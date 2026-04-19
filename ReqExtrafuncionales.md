## Catálogo de Requisitos Extrafuncionales

Clasificación según ISO 25010 y tipo de restricción.
La columna Prioridad refleja la importancia para las decisiones de arquitectura:
Alta, Media o Baja.

| ID     | Tipo                        | Descripción                                                    | Prioridad                 |
| ------ | --------------------------- | -------------------------------------------------------------- | ------------------------- |
| REF-01 | Calidad de servicio         | El sistema debe estar la mayoría del tiempo disponible         | :red_circle: **Alta**     |
| REF-02 | Calidad de servicio (seg.)  | Mínimo de seguridad para datos personales                      | :orange_circle: **Media** |
| REF-03 | Calidad de servicio (perf.) | El sistema debe tener tiempo de respuesta de máximo 5 segundos | :green_circle: **Baja**   |
| REF-04 | Restricción técnica         | La aplicación debe de funcionar en sistemas Android y iOS      | :orange_circle: **Media** |
| REF-05 | Restricción del proyecto    | El prototipo funcional debe estar listo dentro de 6 meses      | :red_circle: **Alta**     |
| REF-06 | Restricción del proyecto    | El presupuesto no debe exceder los CLP$25000000                | :red_circle: **Alta**     |
| REF-07 | Restricción del proyecto    | El equipo debe de ser de máximo 5 personas                     | :orange_circle: **Media** |
| REF-08 | Restricción técnica         | El servidor debe estar alocado en AWS                          | :orange_circle: **Media** |
| REF-09 | Calidad de servicio (esc.)  | El sistema debe soportar al menos 1000 usuarios simultáneos    | :orange_circle: **Media** |
| REF-10 | Calidad de servicio (inc.)  | La interfaz de la aplicación debe estar en inglés y español    | :orange_circle: **Media** |

> Nota: Los requisitos de prioridad Alta deben quedar explícitamente
> abordados en las decisiones de diseño arquitectónico.
