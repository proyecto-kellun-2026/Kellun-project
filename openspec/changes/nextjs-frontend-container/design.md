## Context

El frontend legacy del buscador de voluntariados está construido con HTML/CSS/JS tradicionales y es servido estáticamente por el propio servidor Express mediante `app.use(express.static('public'))`.

Se requiere migrar este frontend a Next.js dentro de un directorio `frontend/` y containerizarlo para separar la capa de presentación de la capa de API, permitiendo levantar todo el sistema orquestado en tres contenedores independientes: `db` (PostgreSQL), `api` (Express) y `frontend` (Next.js).

## Goals / Non-Goals

**Goals:**
- Crear la aplicación Next.js en la subcarpeta `frontend/`.
- Replicar y mejorar la funcionalidad del buscador, filtros dinámicos, reinicio de filtros y notificaciones de inscripción con componentes modernos de React.
- Crear un `Dockerfile` en `frontend/` y el archivo `.dockerignore` correspondiente.
- Actualizar `docker-compose.yml` en la raíz para incluir el servicio `frontend` mapeando el puerto `3001` del host al puerto `3000` del contenedor, y configurando `NEXT_PUBLIC_API_URL`.
- Deshabilitar el servicio de archivos estáticos en la API Express (`index.js`).
- Habilitar CORS en la API Express (`index.js`) utilizando el paquete `cors` para permitir llamadas desde el puerto `3001`.

**Non-Goals:**
- Migrar el segundo servidor Express (`index2.js` de organizaciones) a Next.js.
- Reescribir la base de datos o lógica de negocio ya migrada en los cambios previos.

## Decisions

### 1. Inicialización e Instanciación del Proyecto Next.js
- **Decisión:** En lugar de inicializar Next.js interactivamente (que requiere respuestas del terminal), crearemos manualmente los archivos de configuración básicos en `frontend/`:
  - `package.json` con `next`, `react`, `react-dom`.
  - `src/app/layout.js`, `src/app/page.js`, `src/app/globals.css`.
  - `Dockerfile` y `.dockerignore`.
- **Razón:** Es un enfoque no interactivo muy limpio, rápido, determinista y menos propenso a fallar en entornos sandbox.

### 2. Configuración de CORS en la API
- **Decisión:** Instalar y utilizar el paquete `cors` en la API Express.
- **Razón:** Dado que el frontend correrá en `http://localhost:3001` y la API en `http://localhost:3000`, el navegador del usuario bloqueará las peticiones de origen cruzado (CORS) a menos que la API declare explícitamente que acepta llamadas del frontend (o de cualquier origen en desarrollo).

### 3. Exclusión de Estáticos de Express
- **Decisión:** Eliminar `app.use(express.static('public'));` en [index.js](file:///C:/Users/felip/Documents/Kellun-project/index.js).
- **Razón:** Desacopla completamente las responsabilidades, de modo que la API funcione únicamente como un servicio REST.

### 4. Orquestación y Redirección en el Navegador
- **Decisión:** Configurar la variable `NEXT_PUBLIC_API_URL=http://localhost:3000` en el contenedor del frontend.
- **Razón:** Dado que las llamadas se realizan del lado del cliente (en el navegador del desarrollador), la API debe apuntar a la dirección y puerto que el host mapea hacia el contenedor de la API (puerto 3000 en localhost).

## Risks / Trade-offs

- **[Riesgo] Errores de CORS al realizar llamadas fetch**
  - *Mitigación:* Se implementará middleware de `cors` en Express a nivel global para asegurar que las peticiones fluyan libremente entre puertos locales.
- **[Riesgo] Tamaño de imagen del frontend Next.js**
  - *Mitigación:* Se utilizará la imagen `node:18-alpine` para construir la aplicación en modo desarrollo o producción ligero.
