# Asistente virtual

El asistente se carga desde `index.html` y añade su propio panel, estilos y botón flotante. Las respuestas son demostrativas y se editan en `simulatedResponses` dentro de `va-assistant.js`.

## Conectar una API real

Reemplaza la implementación de `sendToBackend(message)` para enviar el mensaje a un endpoint propio, por ejemplo con `fetch('/api/assistant', ...)`. El servidor debe guardar las credenciales y comunicarse con el proveedor de IA; nunca incluyas claves secretas en el JavaScript del navegador. La función debe devolver una promesa con el texto de respuesta.

El CSS se inyecta como un bloque `<style>`; si el sitio aplica una CSP estricta, la directiva `style-src` debe permitir este estilo inline (por ejemplo, mediante un nonce gestionado por el servidor).
