# Deploy Dance Academy React App
# This script builds and deploys to the production server

param(
    [string]$Server = "82.180.139.4",
    [string]$User = "root",
    [string]$RemotePath = "/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html"
)

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Step 1: Build the app
Write-Host "`n📦 Building React app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build complete!" -ForegroundColor Green

# Step 2: Deploy to server
Write-Host "`n📤 Deploying to server..." -ForegroundColor Yellow
Write-Host "Server: $Server" -ForegroundColor Cyan
Write-Host "Path: $RemotePath" -ForegroundColor Cyan

# Using SCP to copy files
scp -r dist/* ${User}@${Server}:${RemotePath}/

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Visit: https://server.danceacademywhitemountains.com" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Make sure you have SSH access configured" -ForegroundColor Yellow
    exit 1
}
