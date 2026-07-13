# setup.ps1 - Vigan City Open Data Portal Setup Orchestrator (Windows)
# Builds, starts, and initializes the entire stack (CKAN + Next.js + DB).

$ErrorActionPreference = "Stop"

# Change directory to the project root
$MyDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$MyDir\.."

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "Vigan City Open Data Portal - Setup Orchestrator (Windows)" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

$ComposeArgs = @(
  "-f", "docker/docker-compose.yml",
  "-f", "docker/docker-compose.dev.yml"
)

Write-Host "1. Building Docker Images..." -ForegroundColor Green
docker compose @ComposeArgs build

Write-Host "2. Starting Services..." -ForegroundColor Green
docker compose @ComposeArgs up -d

Write-Host "3. Waiting for PostgreSQL and CKAN to initialize (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "4. Running Database Migrations and initial Sysadmin setup..." -ForegroundColor Green
# The prerun.py in the container handles db init and admin creation automatically on startup.

Write-Host "5. Seeding default Vigan Organizations and Datasets..." -ForegroundColor Green
docker compose @ComposeArgs exec ckan bash -c "mkdir -p /tmp/scripts"
docker compose @ComposeArgs cp scripts/seed-data.sh ckan:/tmp/scripts/seed-data.sh
docker compose @ComposeArgs cp sample-datasets ckan:/tmp/sample-datasets
docker compose @ComposeArgs exec ckan chmod +x /tmp/scripts/seed-data.sh
docker compose @ComposeArgs exec ckan /tmp/scripts/seed-data.sh

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Public Portal (Next.js): http://localhost:8080"
Write-Host "CKAN Admin Panel:       http://localhost:8080/user/login"
Write-Host ""
Write-Host "Admin credentials are loaded from docker/.env"
Write-Host ""
Write-Host "To view logs, run: docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml logs -f"
