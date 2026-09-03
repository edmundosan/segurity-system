# Sentinel Security Platform

MVP de un centro de operaciones de seguridad para empresas medianas. El panel reune postura de seguridad, telemetria de endpoints, alertas priorizadas e incidentes asociados a malware y gusanos, con foco en deteccion, contencion y recuperacion.

## Ejecutar

No requiere dependencias ni backend para la demo. Desde la raiz del proyecto:

```bash
python3 server.py
```

También puedes iniciar con `./start-server.sh`. El servidor busca `4173` y, si está ocupado, selecciona automáticamente el siguiente puerto libre e informa la URL exacta en la terminal. Incluye fallback para rutas directas del panel, evitando errores 404 al recargar una URL, y admite un puerto inicial con `PORT=4174 python3 server.py`. Los datos actuales son de demostracion y no representan telemetria real.

El respaldo de la aplicación está en `backups/` y se puede regenerar con:

```bash
./backup.sh
```

## Alcance defensivo

- Visibilidad de activos y postura de seguridad.
- Priorizacion de incidentes por severidad.
- Indicadores de controles de endpoint, copias de seguridad e identidad.
- Acciones simuladas de exportacion, revision y filtrado.
- Modelo preparado para conectar posteriormente un SIEM, EDR, gateway de correo y proveedor de identidad.