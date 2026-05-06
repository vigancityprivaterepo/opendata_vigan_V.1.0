@echo off
chcp 65001 >nul
echo ===========================================================
echo Vigan City Open Data Portal - Setup Orchestrator (Windows)
echo ===========================================================

cd %~dp0\..

echo 1. Building Docker Images...
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml build

echo 2. Starting Services...
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

echo 3. Waiting for PostgreSQL and CKAN to initialize (30 seconds)...
timeout /t 30 /nobreak

echo 4. Running Database Migrations and initial Sysadmin setup...

echo 5. Seeding default Vigan Organizations and Datasets...
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml exec ckan bash -c "mkdir -p /tmp/scripts"
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml cp scripts/seed-data.sh ckan:/tmp/scripts/seed-data.sh
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml exec ckan chmod +x /tmp/scripts/seed-data.sh
docker compose --env-file docker/.env -f docker/docker-compose.yml -f docker/docker-compose.dev.yml exec ckan /tmp/scripts/seed-data.sh

echo ===========================================================
echo Setup Complete!
echo ===========================================================
echo.
echo Public Portal (Next.js): http://localhost
echo CKAN Admin Panel:       http://localhost/user/login
echo.
echo Default Admin Credentials:
echo    Username: vigancity_admin
echo    Password: VCAdmin@2026!
echo.
echo To view logs, run: cd docker ^&^& docker-compose logs -f
