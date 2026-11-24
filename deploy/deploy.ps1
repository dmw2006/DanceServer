# Builds, packages and deploys the site to the server.   Run from the repo root:  .\deploy\deploy.ps1
# -StageOnly builds and packages but does not touch the server.
param(
  [string]$Server = 'root@82.180.139.4',
  [switch]$StageOnly
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$stage = Join-Path $env:TEMP 'dance-release'
$tar = Join-Path $env:TEMP 'dance-release.tar'

function Run($what, [scriptblock]$cmd) {
  Write-Host "== $what"
  & $cmd
  if ($LASTEXITCODE) { throw "$what failed (exit $LASTEXITCODE)" }
}

Run 'Type-check backend' { Push-Location "$root\dance-backend"; try { npx tsc --noEmit } finally { Pop-Location } }
Run 'Build frontend' { Push-Location "$root\dance-react"; try { npm run build } finally { Pop-Location } }

$bundle = Get-ChildItem "$root\dance-react\dist\assets\*.js" | Select-Object -First 1
if (-not $bundle -or (Get-Content "$root\dance-react\dist\index.html" -Raw) -notmatch [regex]::Escape($bundle.Name)) {
  throw 'dist/index.html does not reference the built bundle - is index.html loading /src/main.jsx?'
}

Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory "$stage\scripts", "$stage\images" | Out-Null
Copy-Item "$root\dance-backend\src" "$stage\src" -Recurse
Copy-Item "$root\dance-react\dist" "$stage\dist" -Recurse
Copy-Item "$root\dance-backend\scripts\site-data.js" "$stage\scripts\"
foreach ($f in (git -C $root ls-files client/public/images)) { Copy-Item "$root\$($f -replace '/', '\')" "$stage\images\" }

Run 'Export classes, staff and schedule from the local database' {
  Push-Location "$root\dance-backend"
  try { node scripts/site-data.js export --only=programs,staffmembers,schedules --out="$stage\site-content.json" } finally { Pop-Location }
}
$content = Get-Content "$stage\site-content.json" -Raw | ConvertFrom-Json
"   programs: $($content.programs.Count), staff: $($content.staffmembers.Count), schedule days: $($content.schedules.Count)"
if (-not $content.programs.Count -or -not $content.staffmembers.Count -or -not $content.schedules.Count) { throw 'Export is missing content - stopping.' }

# the server runs Linux: the script must have LF line endings
$sh = (Get-Content "$PSScriptRoot\release.sh" -Raw) -replace "`r`n", "`n"
[IO.File]::WriteAllText("$stage\release.sh", $sh, (New-Object Text.UTF8Encoding($false)))

Run 'Create package' { tar -cf $tar -C $stage . }
"   package: $([math]::Round((Get-Item $tar).Length / 1MB, 1)) MB"
if ($StageOnly) { Write-Host 'Staged only - nothing was sent to the server.'; return }

Write-Host "`nUploading to $Server (you will be asked for the SSH password)"
Run 'Upload' { scp $tar "${Server}:/tmp/dance-release.tar" }
Run 'Deploy on server' { ssh $Server 'rm -rf /tmp/release && mkdir /tmp/release && tar -xf /tmp/dance-release.tar -C /tmp/release && bash /tmp/release/release.sh' }
