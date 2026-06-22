## Why

Para modernizar la arquitectura del frontend, desacoplar la entrega de archivos estáticos del servidor de la API Express, y permitir un desarrollo ágil y escalable utilizando Next.js. Al containerizar el frontend y orquestarlo con Docker Compose junto a `db` y `api`, logramos un entorno de desarrollo y despliegue del sistema completamente autónomo e independiente.

## What Changes

- Creación de un proyecto Next.js en la carpeta `frontend/` del proyecto.
- Desarrollo de componentes de React en Next.js para replicar y mejorar la funcionalidad del buscador, filtrado por tipo e inscripciones de voluntariados con una interfaz moderna y atractiva.
- Creación de un `Dockerfile` en `frontend/` específico para el despliegue del frontend en Next.js.
- Modificación de `docker-compose.yml` en la raíz para añadir el servicio `frontend`, configurar sus variables de entorno (como `NEXT_PUBLIC_API_URL`) y exponerlo en el puerto `3001`.
- Configuración de CORS en la API Express en `index.js` (si es necesario) para permitir peticiones desde el origen del contenedor frontend (`http://localhost:3001`).
- Remoción del middleware de archivos estáticos (`app.use(express.static('public'))`) en la API Express, ya que los archivos estáticos ahora serán servidos por Next.js.

## Capabilities

### New Capabilities
- `nextjs-frontend-container`: Lanzamiento y despliegue de la interfaz de usuario en Next.js (puerto 3001) para buscar, filtrar y registrarse en voluntariados de manera responsiva y conectada a la API Express mediante red de contenedores.

### Modified Capabilities

## Impact

- **Código Afectado**: `docker-compose.yml`, `index.js` (remoción de static path y adición de CORS), nueva carpeta `frontend/`.
- **Entorno**: El host accederá al frontend en `http://localhost:3001`, y las llamadas a la API se realizarán hacia `http://localhost:3000`.
- **Dependencias**: Adición de dependencias de React/Next.js en la carpeta `frontend/`.
