## 1. Estilo Arquitectónico

Estilo adoptado: Event-Driven

Justificación basada en REF priorizados:


| REF ID | Descripción                                                                                                                                                                     | Prioridad | Cómo lo aborda el estilo                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REF-01 | El sistema debe estar disponible el 98%                                                                                                                                         | :red_circle: Alta      | Se adapta bien a una arquitectura de cliente -servidor, ya que se establece independencia del servidor con respecto los clientes para que el sistema de la aplicación esté operativo, dando el servidor control completo sobre disponibilidad del sitio.                                                                                                                                                                          |
| REF-03 | El sistema debe tener tiempo de navegación de máximo 1 segundo                                                                                                                  | :red_circle: Alta      | Se adapta bien a una arquitectura de cliente servidor ya que el procesamiento pesado de datos se delega al servidor, el cual responde enviando únicamente la información necesaria al cliente, lo que permite cumplir con tiempos de respuesta y navegación inferiores a un segundo.                                                                                                                                              |
| REF-05 | El sistema debe permitir la incorporación de cambios en módulos específicos sin afectar la la funcionalidad del resto de los módulos.                                           | :red_circle: Alta      | Se adapta bien a una arquitectura de cliente servidor ya que establece una separación clara entre la capa de interfaz y los procesos detrás de las request hechas en interfaz . Esto permite actualizar, mejorar o corregir módulos específicos en el servidor sin necesidad de modificar el código del cliente ni obligar a los usuarios a reinstalar la aplicación, asegurando la estabilidad del resto de las funcionalidades. |
| REF-06 | El sistema debe adaptar su entorno operativo y visual basándose en el tipo de usuario, facilitando que este reconozca y acceda solo a las herramientas adecuadas para su tarea. | :red_circle: Alta      | Se adapta bien a una arquitectura de cliente servidor ya que el servidor se encarga de validar credenciales del usuario, para luego indicarle a la aplicación qué herramientas y pantallas debe mostrar según el tipo de cuenta, asegurando que un voluntario vea una interfaz de búsqueda mientras que una organización vea una de gestión de eventos, todo de forma independiente.                                              |
| REF-02 | Mínimo de seguridad para datos personales                                                                                                                                       | 🟡 Media     | Con la arquitectura Cliente-Servidor nos permite una gestión concentrada de la seguridad. En lugar de procesar o almacenar datos sensibles localmente en le celular, estos se guardan bajo un servidor seguro con protocolos de autentificación.                                                                                                                                                                                  |
| REF-04 | La aplicación debe de funcionar en sistemas Android y iOS                                                                                                                       | 🟡 Media     | Al utilizar dicha arquitectura, la lógica principal del sistema se mantiene en el servidor. No depende del dispositivo que use cada usuario, ya que tanto la app de Android y la de iOS se conectan a la misma API para obtener o enviar información.                                                                                                                                                                             |
| REF-07 | El equipo debe de ser de máximo 5 personas                                                                                                                                      | 🟡 Media     | Gracias a este modelo se puede dividir en equipos para que cada uno haga algo independiente del otro (Frontend, Backend). Al esta separado por una API, se puede avanzar en paralelo sin obstaculizarse mutuamente.                                                                                                                                                                                                               |
| REF-08 | El servidor debe estar alocado en AWS                                                                                                                                           | 🟡 Media     | React está pensado para consumir datos desde servicios externos, por lo tanto encaja de forma natural con la arquitectura seleccionada. La aplicación se encarga de mostrar la información- y gestionar la interacción con el usuario, mientras que el servidor se encarga de procesar datos y enviarlo.                                                                                                                          |
| REF-09 | El sistema debe soportar al menos 1000 usuarios simultáneos                                                                                                                     | 🟡 Media     | Se adapta bien a una arquitectura de cliente servidor ya que depende del servidor la capacidad de recibir y organizar todas las solicitudes de los 1000 clientes al mismo tiempo, asegurando así que bajo alta demanda los clientes puedan usar la plataforma sin problemas.                                                                                                                                                      |
| REF-10 | Debe garantizar la accesibilidad para usuarios con discapacidad visual total mediante compatibilidad con lectores de pantalla, asegurando una navegación lógica                 | :green_circle: Baja      | Al concentrar los datos en el servidor, es posible enviar información estrucutrada que pueda ser interpretada correctamente por lectores (TalkBack en Android o VoiceOver en iOS). Por otra parte en caso de que se agreguen nuevas categorías de voluntariados o cambios de información, estos se pueden actualizar desde el servidor sin modificar el código de la aplicación.                                                  |


### Justificación

Para el proyecto se seleccionó una arquitectura Event-Driven. La idea principal es desaclopar las interacciones del sistema mediante un bus de eventos robusto, permitiendo una comunicación asincrónica. Esta desición permite garantizar una disponibilidad del 98% al asegurar que el fallo de un componente no detenga la emisión de eventos ni la operación global del sistema. También asegura un rendimiento de navegacion menor a 1 segundo al encargar el procesamiento pesado a trabajadores asincrónicos.

Este modelo facilita la escalabilidad para 1000 usuarios simultáneos, al permitir el crecimiento horizontal e independiente de los usuarios según la carga de eventos generada por las interacciones con las publicaciones. Debido al bajo acoplamiento de este estilo, podemos realizar cambios en módulos específicos sin comprometer la estabilidad del resto del sistema. Con esto, asumimos una mayor complejidad en la trazabilidad de los procesos a cambio de priorizar la escalabilidad masiva y la respuesta en tiempo real ante las acciones de los voluntarios y las organizaciones.

Sin embargo, este modelo implica ciertos sacrificios, por un lado, las respuestas no siempre son instantaneas, el usuario puede sentir que su acción ya terminó, pero como los procesos siguen ocurriendo en el fondo. Por otro lado, ahora dependemos totalmente de un "mensajero" central que reparte la información entre las partes. Si este intermediario llega a fallar, nadie podrá comunicarse entre sí, dejando el sistema inoperante aunque el resto de la aplicación esté funcionando bien.

## 2. Diagrama de Arquitectura

<img width="601" height="351" alt="Diagrama sin título drawio(1)" src="https://github.com/user-attachments/assets/9c1040c6-68b6-4eae-98bc-fd9baf6a3c40" />

## 3. Descomposición Modular

Fundamentación: Por funcionalidad

### Módulo 1: Interfaz de usuario.
- Responsabilidad: Proporciona un medio de interacción para que el voluntario realice búsquedas, configure su perfil y gestione los voluntariados en los que participará.
- Ofrece a otros módulos: Solicitudes realizadas por los voluntarios.
- Depende de: Módulo 3.

### Módulo 2: Interfaz de administración.
- Responsabilidad: Proporciona medio de interacción entre organización y servidor, permitiéndole realizar resolución de solicitudes, publicación de eventos, visualización de perfiles y configuración de su propio perfil.
- Ofrece a otros módulos: Postulación y visualización de eventos.
- Depende de: Módulo 4.

### Módulo 3: Motor de Filtrado y Consultas.
- Responsabilidad: Procesar los criterios de búsqueda del usuario para enviarlos a la API.
- Ofrece a otros módulos: Parámetros de consulta (query parameters) validados.
- Depende de: Módulo 4.

### Módulo 4: API
- Responsabilidad: Actuar como intermediario para recibir peticiones del cliente y delegarlas al servidor.
- Ofrece a otros módulos: Interfaz de comunicación.
- Depende de: Módulos 5, 6, 7 y 8.

### Módulo 5: Motor de Búsqueda
- Responsabilidad: Ejecutar la búsqueda y devolver la información según los criterios recibidos.
- Ofrece a otros módulos: Resultados filtrados y ordenados.
- Depende de: Módulo 10.

### Módulo 6: Autenticaciones
- Responsabilidad: Gestionar el inicio de sesión, validación de credenciales y permisos de acceso.
- Ofrece a otros módulos: Verificación de identidad y tokens de seguridad.
- Depende de: Módulo 4 y 9.

### Módulo 7: Publicación de eventos
- Responsabilidad: Gestionar la creación, edición y eliminación de publicaciones de voluntariado.
- Ofrece a otros módulos: Registro y actualización de actividades.
- Depende de: Módulo 10 (Base de datos de eventos).

### Módulo 8: Notificaciones
- Responsabilidad: Generar y enviar avisos a los usuarios ante eventos relevantes.
- Ofrece a otros módulos: Servicio de alertas.
- Depende de: Módulo 4 y Módulo 10 (para obtener datos de contacto).

### Módulo 9: Base de datos de perfiles
- Responsabilidad: Almacenar identificación, datos personales, configuraciones de privacidad y logros.
- Ofrece a otros módulos: Datos persistentes de usuarios.
- Depende de: Ninguno.

### Módulo 10: Base de datos de Eventos y Publicaciones
- Responsabilidad: Información de eventos publicados, el estado de las postulaciones y la agenda confirmada.
- Ofrece a otros módulos: Persistencia de eventos y registros de postulación.
- Depende de: Ninguno.

### Módulo 11: Almacenamiento de Archivos
- Responsabilidad: Gestionar el repositorio físico de documentos de verificación y archivos multimedia.
- Ofrece a otros módulos: Acceso a archivos y documentos de identidad.
- Depende de: Ninguno.

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
