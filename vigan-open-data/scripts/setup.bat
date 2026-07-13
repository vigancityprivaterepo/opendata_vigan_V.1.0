@echo off
chcp 65001 >nul
echo ===========================================================
echo Vigan City Open Data Portal - Setup Orchestrator (Windows)
echo ===========================================================

cd %~dp0\..
set COMPOSE_FILES=-f docker/docker-compose.yml -f docker/docker-compose.dev.yml

echo 1. Building Docker Images...
docker compose %COMPOSE_FILES% build

echo 2. Starting Services...
docker compose %COMPOSE_FILES% up -d

echo 3. Waiting for PostgreSQL and CKAN to initialize (30 seconds)...
timeout /t 30 /nobreak

echo 4. Running Database Migrations and initial Sysadmin setup...

echo 5. Seeding default Vigan Organizations and Datasets...
docker compose %COMPOSE_FILES% exec ckan bash -c "mkdir -p /tmp/scripts"
docker compose %COMPOSE_FILES% cp scripts/seed-data.sh ckan:/tmp/scripts/seed-data.sh
docker compose %COMPOSE_FILES% cp sample-datasets ckan:/tmp/sample-datasets
docker compose %COMPOSE_FILES% exec ckan chmod +x /tmp/scripts/seed-data.sh
docker compose %COMPOSE_FILES% exec ckan /tmp/scripts/seed-data.sh

echo ===========================================================
echo Setup Complete!
echo ===========================================================
echo.
echo Public Portal (Next.js): http://localhost:8080
echo CKAN Admin Panel:       http://localhost:8080/user/login
echo.
echo Admin credentials are loaded from docker/.env
echo.
echo To view logs, run: docker compose %COMPOSE_FILES% logs -f
