#!/usr/bin/env bash
# Nightly backup of the local MongoDB and the uploaded images. Run as root from cron.
set -euo pipefail

ENV_FILE="${ENV_FILE:-/home/derekmwallace19/dance-backend/.env}"
IMAGES_DIR="${IMAGES_DIR:-/home/derekmwallace19/client/public/images}"
BACKUP_DIR="${BACKUP_DIR:-/root/backups/dance}"
KEEP_DAYS="${KEEP_DAYS:-14}"

umask 077
mkdir -p "$BACKUP_DIR"
stamp=$(date +%F_%H%M)

uri=$(grep -E '^MONGO_URI=' "$ENV_FILE" | head -n1 | cut -d= -f2- | sed -E "s/^['\"]//; s/['\"]\$//")
[ -n "$uri" ] || { echo "MONGO_URI not found in $ENV_FILE" >&2; exit 1; }

# A config file keeps the credentials out of the process list.
cfg=$(mktemp)
trap 'rm -f "$cfg"' EXIT
printf 'uri: "%s"\n' "$uri" > "$cfg"

mongodump --config="$cfg" --gzip --archive="$BACKUP_DIR/mongo-$stamp.archive.gz"

if [ -d "$IMAGES_DIR" ]; then
  tar -czf "$BACKUP_DIR/images-$stamp.tar.gz" -C "$(dirname "$IMAGES_DIR")" "$(basename "$IMAGES_DIR")"
fi

find "$BACKUP_DIR" -type f \( -name 'mongo-*' -o -name 'images-*' \) -mtime +"$KEEP_DAYS" -delete

echo "backup ok: $BACKUP_DIR ($stamp)"
