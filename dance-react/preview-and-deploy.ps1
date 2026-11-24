# Build the app, start a local preview, then deploy after confirmation.

param(
    [string]$Server = "82.180.139.4",
    [string]$User = "root",
    [string]$RemotePath = "/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html",
    [string]$PreviewHost = "127.0.0.1",
    [int]$PreviewPort = 4173
)

$ErrorActionPreference = "Stop"

Write-Host "Starting preview-and-deploy flow..." -ForegroundColor Cyan

Write-Host "`nBuilding React app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build complete!" -ForegroundColor Green

Write-Host "`nStarting local preview..." -ForegroundColor Yellow
Write-Host "Preview URL: http://$PreviewHost`:$PreviewPort" -ForegroundColor Cyan

$previewArgs = @(
    "run", "preview", "--",
    "--host", $PreviewHost,
    "--port", $PreviewPort.ToString()
)

$previewProcess = Start-Process -FilePath "npm.cmd" -ArgumentList $previewArgs -PassThru
Start-Process "http://$PreviewHost`:$PreviewPort"

Write-Host "`nReview the site locally, then press Enter to deploy to production." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel if you want to stop here." -ForegroundColor DarkYellow
[void](Read-Host "Press Enter when you are ready")

if (-not $previewProcess.HasExited) {
    Stop-Process -Id $previewProcess.Id -ErrorAction SilentlyContinue
}

Write-Host "`nDeploying to server..." -ForegroundColor Yellow
Write-Host "Server: $Server" -ForegroundColor Cyan
Write-Host "Path: $RemotePath" -ForegroundColor Cyan

scp -r dist/* ${User}@${Server}:${RemotePath}/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "Visit: https://server.danceacademywhitemountains.com" -ForegroundColor Cyan
} else {
    Write-Host "`nDeployment failed!" -ForegroundColor Red
    Write-Host "Make sure you have SSH access configured" -ForegroundColor Yellow
    exit 1
}