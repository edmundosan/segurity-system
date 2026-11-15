# Asistente virtual y modo de seguridad futurista

La integración no requiere dependencias. `index.html` carga el tema y el asistente; los controles se generan desde `va-assistant.js`. El tema se activa aplicando `va-theme-scifi` al elemento `<html>` y la selección se recuerda en `localStorage` (si el almacenamiento está bloqueado, se usa el modo original sin interrumpir la página).

## Uso

- Usa **Modo original / Modo seguridad** para alternar el tema. El modo original conserva el diseño existente; el asistente permanece disponible.
- Pulsa **Iniciar sistema** para abrir el chat y escuchar la bienvenida en español. La voz solo se reproduce después de ese gesto. **Omitir** muestra la bienvenida solo como texto.
- El control de voz permite silenciar o reactivar la voz de salida.
- Escribe cualquier comando en el campo del chat y pulsa Enter o el botón de envío. Los comandos rápidos también se pueden pulsar.
- El nivel de alerta se cambia desde el indicador superior o mediante un comando. El indicador superior solo se muestra con el tema futurista.
- Se intenta elegir una voz disponible en español de Colombia, México o España; si el navegador no ofrece voz en español, se usa la voz disponible y se conserva el texto del chat.

## Comandos

- `ir a [nombre de sección]` — las secciones se detectan en tiempo de ejecución a partir de encabezados, identificadores y enlaces de navegación.
- `subir`, `bajar`, `leer esta sección`
- `modo seguridad`, `modo original`
- `alerta verde`, `alerta amarilla`, `alerta roja`
- `abrir asistente`, `cerrar asistente`
- `silencio`, `activar voz`
- `ayuda`
- `reportar incidente` — busca un formulario o contacto existente y, si no hay, lleva a una sección de incidentes detectada en la página.

Con el micrófono, di **JARVIS** seguido del comando o pulsa el botón de micrófono para usar el modo pulsar para hablar. El idioma de reconocimiento se configura en `VOICE_LANGUAGE` al inicio de `va-assistant.js`. El reconocimiento de voz depende del navegador y normalmente requiere HTTPS o `localhost`; Firefox y otros navegadores sin `SpeechRecognition` muestran una alternativa por texto y ocultan el control del micrófono. La voz de salida y el reconocimiento son funciones separadas.

## Privacidad y compatibilidad

El micrófono no se inicia hasta pulsar explícitamente el botón y la página no graba, almacena ni envía audio. `SpeechRecognition` puede procesar la voz mediante el servicio del navegador, de acuerdo con su implementación y políticas. Sin soporte de reconocimiento, el chat sigue funcionando por texto. La voz de bienvenida requiere `speechSynthesis` y el clic en **Iniciar sistema** para cumplir las restricciones de reproducción automática.

El asistente no llama a servicios externos ni contiene claves. La función `sendToBackend(message)` en `va-assistant.js` es el punto de extensión para una API real: conéctala a un endpoint propio del mismo origen y guarda cualquier secreto exclusivamente en el servidor.

## Estilos, CSP y mantenimiento

Los estilos de la interfaz original solo se modifican bajo `.va-theme-scifi`; el CSS de la interfaz flotante del asistente se inyecta desde su IIFE para mantener independiente la nueva UI. Una política CSP estricta que prohíba estilos inline puede bloquear esa inyección y requerirá autorizar el estilo o servir esos estilos desde un archivo con la política correspondiente. La página actual es HTML/CSS/JavaScript sin framework; el script emplea capas `z-index` elevadas para mantener accesibles el chat y sus controles. No se modifican las fuentes externas ya referenciadas por la página original.

Las variables de color del tema (`--va-orange`, `--va-peach`, `--va-lilac`, `--va-blue`, `--va-red-alert`) están definidas al principio de `va-theme-scifi.css`. El tema reduce animaciones cuando `prefers-reduced-motion: reduce` está activo.
