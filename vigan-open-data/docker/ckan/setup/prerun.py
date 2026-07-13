#!/usr/bin/env python3
"""
prerun.py - CKAN container initialization script
Runs before the CKAN server starts. Handles:
  1. Database initialization / migration
  2. Sysadmin account creation
  3. DataStore setup
  4. Extension-specific initialization
"""

import os
import subprocess
import sys
import time
from urllib.parse import unquote, urlparse


def run(cmd, check=True):
    """Run a shell command and stream its output."""
    print(f"> {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, capture_output=False, text=True)
    if check and result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def wait_for_postgres(max_retries=30, delay=5):
    """Poll until PostgreSQL is accepting connections."""
    db_url = os.environ.get("CKAN_SQLALCHEMY_URL", "")
    print("Waiting for PostgreSQL...", flush=True)
    for attempt in range(1, max_retries + 1):
        result = subprocess.run(
            [
                "python3",
                "-c",
                f"import sqlalchemy; e=sqlalchemy.create_engine('{db_url}'); e.connect()",
            ],
            capture_output=True,
        )
        if result.returncode == 0:
            print("PostgreSQL is ready.", flush=True)
            return
        print(f"   Attempt {attempt}/{max_retries} - retrying in {delay}s...", flush=True)
        time.sleep(delay)
    print("Could not connect to PostgreSQL. Aborting.", file=sys.stderr)
    sys.exit(1)


def _quote_identifier(value):
    if not value or not value.replace("_", "").isalnum():
        raise ValueError(f"Unsafe SQL identifier: {value!r}")
    return '"' + value.replace('"', '""') + '"'


def _quote_literal(value):
    return "'" + value.replace("'", "''") + "'"


def _psql_env_from_url(db_url):
    env = os.environ.copy()
    parsed = urlparse(db_url)
    if parsed.password:
        env["PGPASSWORD"] = unquote(parsed.password)
    return env


def run_psql(db_url, sql, check=True):
    result = subprocess.run(
        ["psql", db_url, "-v", "ON_ERROR_STOP=1", "-X"],
        input=sql,
        text=True,
        env=_psql_env_from_url(db_url),
    )
    if check and result.returncode != 0:
        print("Failed to run PostgreSQL bootstrap SQL", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def ensure_datastore_database():
    """Repair deployments where Postgres initialized before init.sh completed."""
    db_url = os.environ.get("CKAN_SQLALCHEMY_URL", "")
    datastore_write_url = os.environ.get("CKAN_DATASTORE_WRITE_URL", "")
    datastore_read_url = os.environ.get("CKAN_DATASTORE_READ_URL", "")

    if not db_url or not datastore_write_url or not datastore_read_url:
        print("Datastore URLs are not fully configured; skipping database bootstrap.", flush=True)
        return

    datastore_db = urlparse(datastore_write_url).path.lstrip("/") or "datastore"
    read_user = unquote(urlparse(datastore_read_url).username or "")
    read_password = unquote(urlparse(datastore_read_url).password or "")

    if not read_user or not read_password:
        print("Datastore read credentials are missing; skipping database bootstrap.", flush=True)
        return

    print("Ensuring DataStore database and read-only role exist", flush=True)
    datastore_ident = _quote_identifier(datastore_db)
    read_user_ident = _quote_identifier(read_user)
    read_password_literal = _quote_literal(read_password)

    run_psql(db_url, f"""
SELECT 'CREATE DATABASE {datastore_ident}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = {_quote_literal(datastore_db)})\\gexec

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = {_quote_literal(read_user)}) THEN
        CREATE ROLE {read_user_ident} NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE LOGIN
            PASSWORD {read_password_literal};
    END IF;
END
$$;
""")

    run_psql(datastore_write_url, f"""
GRANT CONNECT ON DATABASE {datastore_ident} TO {read_user_ident};
GRANT USAGE ON SCHEMA public TO {read_user_ident};
GRANT SELECT ON ALL TABLES IN SCHEMA public TO {read_user_ident};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO {read_user_ident};
""")


def apply_datastore_permissions():
    """Generate the datastore SQL and execute it against PostgreSQL."""
    print("Generating datastore permission SQL", flush=True)
    sql = subprocess.check_output(
        ["ckan", "--config=/srv/app/ckan.ini", "datastore", "set-permissions"],
        text=True,
    )

    db_url = os.environ.get("CKAN_SQLALCHEMY_URL", "")
    env = _psql_env_from_url(db_url)

    print("Applying datastore permission SQL via psql", flush=True)
    result = subprocess.run(
        ["psql", db_url],
        input=sql,
        text=True,
        env=env,
    )
    if result.returncode != 0:
        print("Failed to apply datastore permission SQL", file=sys.stderr)
        sys.exit(result.returncode)


def configure_xloader_token(sysadmin_name):
    """Generate a sysadmin API token and persist it into ckan.ini for XLoader."""
    print(f"Generating XLoader API token for '{sysadmin_name}'", flush=True)
    output = subprocess.check_output(
        [
            "ckan",
            "--config=/srv/app/ckan.ini",
            "user",
            "token",
            "add",
            sysadmin_name,
            "xloader_token",
        ],
        text=True,
    )
    token = output.strip().splitlines()[-1].strip()

    ckan_ini = "/srv/app/ckan.ini"
    with open(ckan_ini, "r", encoding="utf-8") as fh:
        lines = fh.readlines()

    setting = f"ckanext.xloader.api_token = {token}\n"
    filtered_lines = [
        line for line in lines
        if not line.strip().startswith("ckanext.xloader.api_token")
    ]

    insert_at = 0
    for idx, line in enumerate(filtered_lines):
        if line.startswith("ckanext.xloader.job_timeout = "):
            insert_at = idx + 1
            break
    filtered_lines.insert(insert_at, setting)

    with open(ckan_ini, "w", encoding="utf-8") as fh:
        fh.writelines(filtered_lines)

    print("XLoader API token written to ckan.ini", flush=True)


def refresh_tracking_summary():
    """Build the initial tracking summary so tracking-backed stats are queryable."""
    print("Refreshing CKAN tracking summary", flush=True)
    run(["ckan", "--config=/srv/app/ckan.ini", "tracking", "update"])
    run(["ckan", "--config=/srv/app/ckan.ini", "search-index", "rebuild"])
    print("Tracking summary refreshed", flush=True)


def main():
    print("\n==========================================")
    print("  Vigan City Open Data Portal - prerun")
    print("==========================================\n")

    wait_for_postgres()
    ensure_datastore_database()

    print("\n-- Step 1: DB init / upgrade --")
    run(["ckan", "--config=/srv/app/ckan.ini", "db", "upgrade"])

    print("\n-- Step 2: DataStore init --")
    apply_datastore_permissions()

    sysadmin_name = os.environ.get("CKAN_SYSADMIN_NAME", "vigancity_admin")
    sysadmin_pass = os.environ.get("CKAN_SYSADMIN_PASSWORD", "")
    sysadmin_email = os.environ.get("CKAN_SYSADMIN_EMAIL", "admin@vigan.gov.ph")

    if not sysadmin_pass:
        print("CKAN_SYSADMIN_PASSWORD is required.", file=sys.stderr)
        sys.exit(1)

    print(f"\n-- Step 3: Ensuring sysadmin '{sysadmin_name}' exists --")
    check = subprocess.run(
        ["ckan", "--config=/srv/app/ckan.ini", "user", "show", sysadmin_name],
        capture_output=True,
        text=True,
    )
    if check.returncode != 0:
        run([
            "ckan",
            "--config=/srv/app/ckan.ini",
            "user",
            "add",
            sysadmin_name,
            f"password={sysadmin_pass}",
            f"email={sysadmin_email}",
        ])
        run(["ckan", "--config=/srv/app/ckan.ini", "sysadmin", "add", sysadmin_name])
        print(f"Sysadmin '{sysadmin_name}' created.", flush=True)
    else:
        print(f"Sysadmin '{sysadmin_name}' already exists - skipping.", flush=True)

    print("\n-- Step 4: XLoader token --")
    configure_xloader_token(sysadmin_name)

    if os.environ.get("CKAN_RUN_STARTUP_MAINTENANCE", "false").lower() == "true":
        print("\n-- Step 5: Tracking summary --")
        refresh_tracking_summary()
    else:
        print("\n-- Step 5: Tracking summary skipped --")
        print("Set CKAN_RUN_STARTUP_MAINTENANCE=true to run it during startup.")

    print("\nprerun.py complete - handing off to CKAN server.\n")


if __name__ == "__main__":
    main()