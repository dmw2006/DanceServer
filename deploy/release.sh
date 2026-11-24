#!/usr/bin/env bash
# Runs ON THE SERVER, started by deploy/deploy.ps1. Expects the upload in /tmp/release:
#   src/  dist/  images/  scripts/site-data.js  site-content.json
# Backs everything up first and rolls the code back if the health checks fail.
set -euo pipefail

APP=/home/derekmwallace19
BACK=$APP/dance-backend
FRONT=$APP/dance-react
REL=/tmp/release
KEEP=/root/backups/release-$(date +%Y%m%d-%H%M%S)
PM2_NAME=dance-backend

mkdir -p "$KEEP"
echo "== Backup to $KEEP"
cp -a "$BACK/src" "$KEEP/backend-src"
cp -a "$BACK/dist" "$KEEP/backend-dist"
cp -a "$FRONT/dist" "$KEEP/frontend-dist"
cp "$REL/scripts/site-data.js" "$BACK/scripts/site-data.js"
(cd "$BACK" && node scripts/site-data.js export --out="$KEEP/db-before.json")
echo "   database snapshot: $(du -h "$KEEP/db-before.json" | cut -f1)"

rollback() {
  echo "!! Health check failed - restoring previous code"
  rm -rf "$BACK/src" "$BACK/dist" "$FRONT/dist"
  cp -a "$KEEP/backend-src" "$BACK/src"
  cp -a "$KEEP/backend-dist" "$BACK/dist"
  cp -a "$KEEP/frontend-dist" "$FRONT/dist"
  pm2 restart "$PM2_NAME" --update-env >/dev/null
  echo "   code restored. To restore the database too:"
  echo "   cd $BACK && node scripts/site-data.js import $KEEP/db-before.json --replace"
  exit 1
}

echo "== Backend code"
rm -rf "$BACK/src"
cp -a "$REL/src" "$BACK/src"
(cd "$BACK" && npx tsc) || rollback

echo "== Frontend"
rm -rf "$FRONT/dist"
cp -a "$REL/dist" "$FRONT/dist"

echo "== Images (existing files are never overwritten)"
mkdir -p "$APP/client/public/images"
cp -an "$REL/images/." "$APP/client/public/images/"

echo "== Restart"
pm2 restart "$PM2_NAME" --update-env >/dev/null

echo "== Content (classes, staff, schedule replaced; news added/updated, posts made on the server are kept)"
(cd "$BACK" && node scripts/site-data.js import "$REL/site-content.json" --replace --append=contents)

echo "== Health checks"
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
count() { curl -s "$1" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).length))'; }
for i in $(seq 1 20); do [ "$(code http://127.0.0.1:5000/api/programs)" = 200 ] && break; sleep 1; done

fail=0
check() { if [ "$2" = "$3" ]; then echo "   ok   $1 = $2"; else echo "   FAIL $1: got $2, expected $3"; fail=1; fi; }
check "GET /"                        "$(code http://127.0.0.1:5000/)"                              200
check "GET /api/programs"            "$(code http://127.0.0.1:5000/api/programs)"                  200
check "GET /api/hero-slides"         "$(code http://127.0.0.1:5000/api/hero-slides)"               200
check "GET /api/content"             "$(code http://127.0.0.1:5000/api/content)"                   200
check "GET /api/auth/users (no token)" "$(code http://127.0.0.1:5000/api/auth/users)"             401
check "POST /api/auth/register"      "$(code -X POST http://127.0.0.1:5000/api/auth/register)"     404
check "program count"                "$(count http://127.0.0.1:5000/api/programs)"                 "$(node -e 'console.log(require("'"$REL"'/site-content.json").programs.length)')"
check "staff count"                  "$(count http://127.0.0.1:5000/api/staff)"                    "$(node -e 'console.log(require("'"$REL"'/site-content.json").staffmembers.length)')"
check "schedule days"                "$(count http://127.0.0.1:5000/api/schedule)"                 "$(node -e 'console.log(require("'"$REL"'/site-content.json").schedules.length)')"
for id in $(node -e 'for (const c of require("'"$REL"'/site-content.json").contents || []) console.log(c._id.$oid || c._id)'); do
  check "news post $id" "$(curl -s http://127.0.0.1:5000/api/content | grep -c "$id")" 1
done
[ "$fail" = 0 ] || rollback
echo "   info public site (https) = $(code https://danceacademywhitemountains.com/)"
echo "== Done. Backup kept at $KEEP"
