## Catálogo de Requisitos Extrafuncionales

Clasificación según ISO 25010 y tipo de restricción.
La columna Prioridad refleja la importancia para las decisiones de arquitectura:
Alta, Media o Baja.

| ID     | Tipo                                           | Descripción                                                                                                                                                                     | Prioridad                 |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| REF-01 | Calidad de servicio (Eficiencia de desempeño)  | El sistema debe estar disponible el 98%                                                                                                                                         | :red_circle: **Alta**     |
| REF-02 | Calidad de servicio (Seguridad)                | Mínimo de seguridad para datos personales                                                                                                                                       | :yellow_circle: **Media** |
| REF-03 | Calidad de servicio (Eficiencia de desempeño)  | El sistema debe tener tiempo de navegación de máximo 1 segundo                                                                                                                  | :red_circle: **Alta**     |
| REF-04 | Restricción técnica                            | La aplicación debe de funcionar en sistemas Android y iOS                                                                                                                       | :yellow_circle: **Media** |
| REF-05 | Calidad de servicio (Mantenibilidad)           | El sistema debe permitir la incorporación de cambios en módulos específicos sin afectar la la funcionalidad del resto de los modulos.                                           | :red_circle: **Alta** |
| REF-06 | Calidad de servicio (Mantenibilidad)           | El sistema debe adaptar su entorno operativo y visual basándose en el tipo de usuario, facilitando que este reconozca y acceda solo a las herramientas adecuadas para su tarea. | :yellow_circle: **Media** |
| REF-07 | Restricción del proyecto                       | El equipo debe de ser de máximo 5 personas                                                                                                                                      | :yellow_circle: **Media** |
| REF-08 | Restricción técnica                            | El servidor debe estar alocado en AWS                                                                                                                                           | :yellow_circle: **Media** |
| REF-09 | Calidad de servicio (Flexibilidad)             | El sistema debe soportar al menos 1000 usuarios simultáneos                                                                                                                     | :yellow_circle: **Media**     |
| REF-10 | Calidad de servicio (Capacidad de interacción) | Debe garantizar la accesibilidad para usuarios con discapacidad visual total mediante compatibilidad con lectores de pantalla, asegurando una navegacion logica                 | :green_circle: **Baja** |
