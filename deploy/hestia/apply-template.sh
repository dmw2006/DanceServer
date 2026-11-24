#!/usr/bin/env bash
# Installs the dancesite Hestia template and applies it to the main domain.
# Checks the generated config against the known-good copy and restores the
# previous config automatically if anything differs or the site stops answering.
# Run as root from the folder holding dancesite.tpl and dancesite.stpl.
set -u

U=derekmwallace19
DOM=danceacademywhitemountains.com
SRC="$(cd "$(dirname "$0")" && pwd)"
TPL_DIR=/usr/local/hestia/data/templates/web/nginx
CONF=/home/$U/conf/web/$DOM
GOLD=/root/golden-nginx-2026-11-23
SAVE=/root/conf-before-template-$(date +%F-%H%M)

[ "$(id -u)" -eq 0 ] || { echo "Run as root."; exit 1; }
[ -f "$GOLD/nginx.conf" ] && [ -f "$GOLD/nginx.ssl.conf" ] || { echo "Golden copy missing in $GOLD."; exit 1; }
[ -f "$SRC/dancesite.tpl" ] && [ -f "$SRC/dancesite.stpl" ] || { echo "Template files missing next to this script."; exit 1; }

mkdir -p "$SAVE" && cp -a "$CONF/nginx.conf" "$CONF/nginx.ssl.conf" "$SAVE/" && echo "Saved current config to $SAVE"

restore() {
  echo "RESTORING previous config from $SAVE"
  cp -a "$SAVE/nginx.conf" "$SAVE/nginx.ssl.conf" "$CONF/"
  nginx -t && systemctl reload nginx
}

strip() { grep -v '^#' "$1"; }

same_as_golden() {
  local ok=0
  diff -wB <(strip "$GOLD/nginx.conf") <(strip "$CONF/nginx.conf") || ok=1
  diff -wB <(strip "$GOLD/nginx.ssl.conf") <(strip "$CONF/nginx.ssl.conf") || ok=1
  return $ok
}

site_ok() {
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://www.$DOM/api/programs")
  [ "$code" = "200" ] && echo "Site check OK (HTTP $code)" || { echo "Site check FAILED (HTTP $code)"; return 1; }
}

for d in "$TPL_DIR" "$TPL_DIR/php-fpm"; do
  install -m 644 "$SRC/dancesite.tpl" "$SRC/dancesite.stpl" "$d/"
done
echo "Template installed."

/usr/local/hestia/bin/v-change-web-domain-tpl "$U" "$DOM" dancesite || { echo "Applying the template failed."; restore; exit 1; }
same_as_golden || { echo "Generated config differs from the known-good one."; restore; exit 1; }
nginx -t || { restore; exit 1; }
site_ok || { restore; exit 1; }

echo "Simulating a Hestia rebuild..."
/usr/local/hestia/bin/v-rebuild-web-domain "$U" "$DOM" || { echo "Rebuild failed."; restore; exit 1; }
same_as_golden || { echo "Config changed after rebuild."; restore; exit 1; }
nginx -t || { restore; exit 1; }
site_ok || { restore; exit 1; }

echo "DONE: dancesite template applied and survives a rebuild."
