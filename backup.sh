#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p backups
backup="backups/sentinel-$(date +%Y%m%d-%H%M%S).tar.gz"
tar --exclude='./.git' --exclude='./backups' --exclude='./__pycache__' -czf "$backup" \
  README.md index.html styles.css app.js server.py start-server.sh backup.sh
printf 'Respaldo creado: %s\n' "$backup"