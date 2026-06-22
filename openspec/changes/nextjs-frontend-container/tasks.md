## 1. Inicialización de la App Next.js

- [x] 1.1 Crear la estructura de directorios del frontend y configurar el archivo `frontend/package.json` con las dependencias necesarias.
- [x] 1.2 Crear el archivo `frontend/next.config.js` de configuración.
- [x] 1.3 Implement el layout de la app y copiar/adaptar la hoja de estilos global en `frontend/src/app/globals.css`.
- [x] 1.4 Desarrollar la página interactiva principal en `frontend/src/app/page.js` replicando los filtros, búsquedas y notificaciones de inscripción mediante Client Components.

## 2. Docker y Orquestación de Contenedores

- [x] 2.1 Crear el archivo `frontend/Dockerfile` y `frontend/.dockerignore` específicos para la compilación de la app Next.js.
- [x] 2.2 Modificar `docker-compose.yml` en la raíz para incorporar el servicio `frontend` mapeando el puerto `3001:3000` del host.

## 3. Modificaciones en la API Express

- [x] 3.1 Instalar el paquete `cors` en el `package.json` raíz.
- [x] 3.2 Refactorizar `index.js` para aplicar el middleware `cors`, habilitar origen cruzado y remover el middleware estático de la carpeta `public`.

## 4. Verificación y Pruebas

- [x] 4.1 Levantar el ecosistema completo con `docker compose up -d --build`.
- [x] 4.2 Probar que la interfaz en `http://localhost:3001` obtenga la lista de voluntariados y permita la búsqueda.
- [ ] 4.3 Detener el servicio `api` y validar que el frontend Next.js muestre la advertencia/mensaje de error correspondiente.
