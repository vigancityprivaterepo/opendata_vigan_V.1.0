-- =============================================================================
-- init.sql — PostgreSQL initialization for Vigan City Open Data Portal
-- Runs once when the container is first created.
-- =============================================================================

-- ── DataStore database ────────────────────────────────────────────────────────
-- CKAN's DataStore extension needs a separate DB for tabular resource storage.
CREATE DATABASE datastore
    OWNER ckan
    ENCODING 'UTF8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8'
    TEMPLATE template0;

-- ── Read-only user for DataStore ─────────────────────────────────────────────
-- This user is used by CKAN to expose the DataStore API publicly (read-only).
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'datastore_ro'
    ) THEN
        CREATE ROLE datastore_ro NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE LOGIN
            PASSWORD 'datastore';
    END IF;
END
$$;

-- ── Connect to the datastore database and grant permissions ──────────────────
\connect datastore

-- Grant connect privilege
GRANT CONNECT ON DATABASE datastore TO datastore_ro;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO datastore_ro;

-- Grant read-only on all current and future tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO datastore_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO datastore_ro;

-- ── Back to ckan database ─────────────────────────────────────────────────────
\connect ckan

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- trigram index for fast LIKE searches
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- accent-insensitive search

-- ── Connection tuning (for the ckan database) ─────────────────────────────────
-- These are advisory comments — actual tuning goes in postgresql.conf
-- Recommended for CKAN on moderate hardware:
-- max_connections = 100
-- shared_buffers = 256MB
-- effective_cache_size = 768MB
-- work_mem = 4MB
-- maintenance_work_mem = 64MB
