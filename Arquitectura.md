## 1. Estilo Arquitectónico

Estilo adoptado: [nombre del estilo, ej: Cliente-Servidor, Capas, etc.]

Justificación basada en REF priorizados:

| REF ID | Descripción                                                                                                                                                                     | Prioridad | Cómo lo aborda el estilo                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REF-01 | El sistema debe estar disponible el 98%                                                                                                                                         | Alta      | Se adapta bien a una arquitectura de cliente -servidor, ya que se establece independencia del servidor con respecto los clientes para que el sistema de la aplicación esté operativo, dando el servidor control completo sobre disponibilidad del sitio.                                                                                                                                                                          |
| REF-03 | El sistema debe tener tiempo de navegación de máximo 1 segundo                                                                                                                  | Alta      | Se adapta bien a una arquitectura de cliente servidor ya que el procesamiento pesado de datos se delega al servidor, el cual responde enviando únicamente la información necesaria al cliente, lo que permite cumplir con tiempos de respuesta y navegación inferiores a un segundo.                                                                                                                                              |
| REF-09 | El sistema debe soportar al menos 1000 usuarios simultáneos                                                                                                                     | Alta      | Se adapta bien a una arquitectura de cliente servidor ya que depende del servidor la capacidad de recibir y organizar todas las solicitudes de los 1000 clientes al mismo tiempo, asegurando así que bajo alta demanda los clientes puedan usar la plataforma sin problemas.                                                                                                                                                      |
| REF-02 | Mínimo de seguridad para datos personales                                                                                                                                       | Media     | Con la arquitectura Cliente-Servidor nos permite una gestión concentrada de la seguridad. En lugar de procesar o almacenar datos sensibles localmente en le celular, estos se guardan bajo un servidor seguro con protocolos de autentificación.                                                                                                                                                                                  |
| REF-04 | La aplicación debe de funcionar en sistemas Android y iOS                                                                                                                       | Media     | Al utilizar dicha arquitectura, la lógica principal del sistema se mantiene en el servidor. No depende del dispositivo que use cada usuario, ya que tanto la app de Android y la de iOS se conectan a la misma API para obtener o enviar información.                                                                                                                                                                             |
| REF-05 | El sistema debe permitir la incorporación de cambios en módulos específicos sin afectar la la funcionalidad del resto de los módulos.                                           | Media     | Se adapta bien a una arquitectura de cliente servidor ya que establece una separación clara entre la capa de interfaz y los procesos detrás de las request hechas en interfaz . Esto permite actualizar, mejorar o corregir módulos específicos en el servidor sin necesidad de modificar el código del cliente ni obligar a los usuarios a reinstalar la aplicación, asegurando la estabilidad del resto de las funcionalidades. |
| REF-06 | El sistema debe adaptar su entorno operativo y visual basándose en el tipo de usuario, facilitando que este reconozca y acceda solo a las herramientas adecuadas para su tarea. | Media     | Se adapta bien a una arquitectura de cliente servidor ya que el servidor se encarga de validar credenciales del usuario, para luego indicarle a la aplicación qué herramientas y pantallas debe mostrar según el tipo de cuenta, asegurando que un voluntario vea una interfaz de búsqueda mientras que una organización vea una de gestión de eventos, todo de forma independiente.                                              |
| REF-07 | El equipo debe de ser de máximo 5 personas                                                                                                                                      | Media     | Gracias a este modelo se puede dividir en equipos para que cada uno haga algo independiente del otro (Frontend, Backend). Al esta separado por una API, se puede avanzar en paralelo sin obstaculizarse mutuamente.                                                                                                                                                                                                               |
| REF-08 | El servidor debe estar alocado en AWS                                                                                                                                           | Media     | React está pensado para consumir datos desde servicios externos, por lo tanto encaja de forma natural con la arquitectura seleccionada. La aplicación se encarga de mostrar la información- y gestionar la interacción con el usuario, mientras que el servidor se encarga de procesar datos y enviarlo.                                                                                                                          |
| REF-10 | Debe garantizar la accesibilidad para usuarios con discapacidad visual total mediante compatibilidad con lectores de pantalla, asegurando una navegación lógica                 | Media     | Al concentrar los datos en el servidor, es posible enviar información estrucutrada que pueda ser interpretada correctamente por lectores (TalkBack en Android o VoiceOver en iOS). Por otra parte en caso de que se agreguen nuevas categorías de voluntariados o cambios de información, estos se pueden actualizar desde el servidor sin modificar el código de la aplicación.                                                  |

### Justificación

Para el proyecto se selecciono una arquitectura Cliente-Servidor. La idea principal es abordar toda la lógica de negocio en una API robusta. Esta decisión permite garantizar una disponibilidad del 98% mediante infraestructura en la nube y asegurar un rendimiento de navegación menor a 1 segundo al descargar el procesamiento pesado del dispositivo móvil.

Este modelo facilita la escalabilidad para 1000 usuarios al permitir el crecimiento horizontal del backend sin afectar la aplicación instalada. Sin embargo, se asume una dependencia total de la conexión a internet, sacrificando la funcionalidad offline en favor de la sincronización de eventos en tiempo real y una menor complejidad operativa para nuestro equipo

## 2. Diagrama de Arquitectura

[Insertar diagrama que muestre el estilo y los módulos.
Ejemplo: ![Diagrama de Arquitectura](./diagrama_arquitectura.png)]

## 3. Descomposición Modular

Fundamentación: [Criterio de descomposición: por dominio, capa, funcionalidad, etc.]

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
- Decisión: [qué se decide]
- Motivación: [por qué, referenciando REF si aplica]
- Alternativas consideradas: [qué otras opciones se evaluaron]
- Impacto: [en qué módulos o REF afecta]
