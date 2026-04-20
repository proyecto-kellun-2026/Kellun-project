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
