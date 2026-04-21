## 1. Estilo Arquitectónico

Estilo adoptado: Event-Driven

Justificación basada en REF priorizados:


| REF ID | Descripción                                                                                                                                                                     | Prioridad | Cómo lo aborda el estilo                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REF-01 | El sistema debe estar disponible el 98%                                                                                                                                         | :red_circle: Alta      | Se adapta bien a una arquitectura de event-driven, ya que al establecerse modularización, si falla una de los módulos solamente se cae la sección de dicho módulo, permitiendo errores parciales sin la caida total del sistema                                                                                                                                                                          |
| REF-03 | El sistema debe tener tiempo de navegación de máximo 1 segundo                                                                                                                  | :red_circle: Alta      | Se adapta parcialmente a una arquitectura de event driven, ya que cuando un usuario ingresa una solicitud/consulta, la interfaz puede reaccionar de inmediato confirmando la recepción, mientras el procesamiento pesado ocurre en segundo plano de forma asíncrona. Esto evita que el usuario quede bloqueado esperando una respuesta del servidor para poder navegar.                                                                                                                                              |
| REF-05 | El sistema debe permitir la incorporación de cambios en módulos específicos sin afectar la la funcionalidad del resto de los módulos.                                           | :red_circle: Alta      | Se adapta fuertemente a una arquitectura de event-driven, ya que esta arquitectura facilita la independencia entre las funcionalidades del sistema. Esto permite actualizar, mejorar o corregir módulos específicos en el servidor sin necesidad de modificar el código de otros módulos, asegurando la estabilidad del resto de las funcionalidades. |
| REF-06 | El sistema debe adaptar su entorno operativo y visual basándose en el tipo de usuario, facilitando que este reconozca y acceda solo a las herramientas adecuadas para su tarea. | :red_circle: Alta      | No se adapta tan bien a una arquitectura de event- driven, ya que la interfaz de usuario necesita una respuesta síncrona para evitar estados de carga indeterminados                                             |
| REF-02 | Mínimo de seguridad para datos personales                                                                                                                                       | 🟡 Media     | Se adapta regularmente a arquitectura event driven, debido que a pesar que  ofrece una trazabilidad eficiente, aumenta la las probabilidades de ataque al contrar el fujo de datos en el bus de de eventos.                                                                                                                              |
| REF-04 | La aplicación debe de funcionar en sistemas Android y iOS                                                                                                                       | 🟡 Media     | Se adapta muy bien a la arquitectura event-driven, ya que estos sistemas se caracterizan por ser independientes al usuario y actuan como creadores de eventos, los cuales serán recibidos por la modularización orientada a consumidores de eventos.                                                                                                                                                                             |
| REF-07 | El equipo debe de ser de máximo 5 personas                                                                                                                                      | 🟡 Media     | Se adapta bien a la arquitectura de event-driven, ya que permite que un equipo pequeño trabaje en "flujos de eventos" independientes, haciendo más eficiente el trabajo.                                                                                                                                                                                                              |
| REF-08 | El servidor debe estar alocado en AWS                                                                                                                                           | 🟡 Media     | La arquitectura event-driven es ideal para esta restricción, ya que AWS está diseñado nativamente para este estilo, facilitando la implementación sin tener que gestionar servidores físicos.                                                                                                                          |
| REF-09 | El sistema debe soportar al menos 1000 usuarios simultáneos                                                                                                                     | 🟡 Media     | Se adapta regularmente a una arquitectura de event-driven, ya que las peticiones se encolan como eventos. Esto permite el la suavización de carga, por lo que el sistema procesa los eventos a su propio ritmo sin colapsar, garantizando que todos los usuarios sean atendidos.                                                                                                                                                      |
| REF-10 | Debe garantizar la accesibilidad para usuarios con discapacidad visual total mediante compatibilidad con lectores de pantalla, asegurando una navegación lógica                 | :green_circle: Baja      | Al separar la lógica del estado (eventos) de la representación visual, se puede asegurar que los eventos de "actualización de datos" disparen cambios en la interfaz que los lectores de pantalla (TalkBack/VoiceOver) y los detecten de forma clara y estructurada, sin ruidos de recargas de página completas.                                                  |


### Justificación

Para el proyecto se seleccionó una arquitectura Event-Driven. La idea principal es desaclopar las interacciones del sistema mediante un bus de eventos robusto, permitiendo una comunicación asincrónica. Esta desición permite garantizar una disponibilidad del 98% al asegurar que el fallo de un componente no detenga la emisión de eventos ni la operación global del sistema. También asegura un rendimiento de navegacion menor a 1 segundo al encargar el procesamiento pesado a trabajadores asincrónicos.

Este modelo facilita la escalabilidad para 1000 usuarios simultáneos, al permitir el crecimiento horizontal e independiente de los usuarios según la carga de eventos generada por las interacciones con las publicaciones. Debido al bajo acoplamiento de este estilo, podemos realizar cambios en módulos específicos sin comprometer la estabilidad del resto del sistema. Con esto, asumimos una mayor complejidad en la trazabilidad de los procesos a cambio de priorizar la escalabilidad masiva y la respuesta en tiempo real ante las acciones de los voluntarios y las organizaciones.

Sin embargo, este modelo implica ciertos sacrificios, por un lado, las respuestas no siempre son instantaneas, el usuario puede sentir que su acción ya terminó, pero como los procesos siguen ocurriendo en el fondo. Por otro lado, ahora dependemos totalmente de un "mensajero" central que reparte la información entre las partes. Si este intermediario llega a fallar, nadie podrá comunicarse entre sí, dejando el sistema inoperante aunque el resto de la aplicación esté funcionando bien.

## 2. Diagrama de Arquitectura

<img width="601" height="351" alt="Diagrama sin título drawio(1)" src="https://github.com/user-attachments/assets/9c1040c6-68b6-4eae-98bc-fd9baf6a3c40" />

## 3. Descomposición Modular

Fundamentación: Por funcionalidad

### Módulo 1: Búsqueda.
- Responsabilidad: Ejecutar la búsqueda y devolver la información según los criterios recibidos.
- Ofrece a otros módulos: Información requerida según criterios.
- Depende de: Módulo 4, 6 y 7.

### Módulo 2: Inscripciones.
- Responsabilidad: Gestionar la postulación y resolución de inscripciones.
- Ofrece a otros módulos: Información sobre voluntario solicitante y estado de resolución.
- Depende de: Módulo 4, 6 y 7.

### Módulo 3: Notificaciones.
- Responsabilidad: Generar y enviar avisos a los usuarios ante eventos relevantes.
- Ofrece a otros módulos: alertas sobre actualizaciones y nuevas entradas.
- Depende de: Módulo 2, 4, 5, 6 y 7

### Módulo 4: Administración consultas
- Responsabilidad: Procesar, recibir y entregar consultas.
- Ofrece a otros módulos: Enrutar consultas a módulos respectivos.
- Depende de: No tiene dependencias.

### Módulo 5: Eventos.
- Responsabilidad: Gestionar la creación, edición y eliminación de publicaciones de eventos.
- Ofrece a otros módulos: Información acerca de los eventos.
- Depende de: Módulo 1, 4 y 7.

### Módulo 6: Interfaz de Voluntario.
- Responsabilidad: Proporciona un medio de interacción para que el voluntario configure su perfil y gestione los voluntariados en los que participará.
- Ofrece a otros módulos: Solicitudes de participación e información de perfil de voluntario.
- Depende de: Módulos 1, 2, 3 y 4.

### Módulo 7: Interfaz de organización.
- Responsabilidad: Proporciona medio de interacción entre organización y servidor, permitiéndole realizar resolución de solicitudes, publicación de eventos, visualización de perfiles y configuración de su propio perfil.
- Ofrece a otros módulos: Resolución de eventos, visualización de información de eventos.
- Depende de: Módulos 3, 4 y 5.

## 4. Decisiones de Diseño

### Decisión 1
- Decisión: Usar estilo de arquitectura Event-Driven
- Motivación: Debido a que se prioriza la modularidad (REF-05, REF-06)
- Alternativas consideradas: Modelo Cliente-Servidor
- Impacto: Impacta el tiempo de respuesta
### Decisión 2 
- Decisión: Usar criterio de modulariazión por funcionalidad 
- Motivación: La complejidad en este criterio no es tan alta ni tan baja comparado con las otras alternativas
- Alternativas consideradas: Por capas y por dominio 
- Impacto: El diseño del diagrama de arquitectura
