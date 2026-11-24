# Copies the live site's content and pictures down to this PC so the local copy matches the website.
# Run from the repo root:   .\deploy\pull-from-server.ps1        (or  -Only programs,staffmembers  for just some sections)
# Your current local content is saved to backups\ first. Users and passwords are never copied.
param(
  [string]$Server = 'root@82.180.139.4',
  [string[]]$Only
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$work = Join-Path $env:TEMP 'dance-pull'
$backupDir = Join-Path $root 'backups'
$backup = Join-Path $backupDir ("local-before-pull-{0}.json" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
$allNames = 'programs', 'staffmembers', 'galleries', 'contents', 'highlights', 'testimonials', 'schedules', 'heroslides', 'pagesettings'
$names = if ($Only) { $Only } else { $allNames }

function Run($what, [scriptblock]$cmd) {
  Write-Host "== $what"
  & $cmd
  if ($LASTEXITCODE) { throw "$what failed (exit $LASTEXITCODE)" }
}

function Count-Of($data, $name) {
  if ($data.PSObject.Properties[$name]) { @($data.$name).Count } else { 0 }
}

Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory $work, $backupDir -Force | Out-Null

$onlyArg = if ($Only) { " --only=$($Only -join ',')" } else { '' }
$remote = "rm -rf /tmp/pull /tmp/pull.tar && mkdir -p /tmp/pull && cd /home/derekmwallace19/dance-backend && node scripts/site-data.js export$onlyArg --out=/tmp/pull/site-data.json && cp -a /home/derekmwallace19/client/public/images /tmp/pull/images && tar -cf /tmp/pull.tar -C /tmp/pull . && rm -rf /tmp/pull"

Write-Host "Connecting to $Server (you will be asked for the SSH password twice)"
Run 'Export on the server' { ssh $Server $remote }
Run 'Download' { scp "${Server}:/tmp/pull.tar" "$work\pull.tar" }
Run 'Unpack' { tar -xf "$work\pull.tar" -C $work }

Run 'Back up the current local content' {
  Push-Location "$root\dance-backend"
  try { node scripts/site-data.js export --out="$backup" } finally { Pop-Location }
}

$site = Get-Content "$work\site-data.json" -Raw | ConvertFrom-Json
$local = Get-Content $backup -Raw | ConvertFrom-Json
Write-Host ''
Write-Host ('{0,-14} {1,8} {2,10}' -f 'Section', 'Website', 'Local now')
foreach ($n in $names) { Write-Host ('{0,-14} {1,8} {2,10}' -f $n, (Count-Of $site $n), (Count-Of $local $n)) }
Write-Host ''
Write-Host 'These local sections will be REPLACED by the website versions (local-only items in them are removed).'
Write-Host "A copy of your current local content is saved at: $backup"
if ((Read-Host 'Type YES to continue') -ne 'YES') { Write-Host 'Cancelled - nothing changed.'; return }

Run 'Import into the local database' {
  Push-Location "$root\dance-backend"
  try { node scripts/site-data.js import "$work\site-data.json" --replace } finally { Pop-Location }
}

Write-Host '== Copy new pictures (existing local files are kept)'
robocopy "$work\images" "$root\client\public\images" /E /XC /XN /XO /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Copying pictures failed (robocopy exit $LASTEXITCODE)" }

Write-Host ''
Write-Host 'Done. Local now matches the website. To undo:'
Write-Host "  cd $root\dance-backend; node scripts/site-data.js import `"$backup`" --replace"
