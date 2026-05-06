#!/usr/bin/env python3
"""
prerun.py — CKAN container initialization script
Runs before the CKAN server starts. Handles:
  1. Database initialization / migration
  2. Sysadmin account creation
  3. DataStore setup
  4. Extension-specific initialization
"""

import os
import sys
import subprocess
import time


def run(cmd, check=True):
    """Run a shell command and stream its output."""
    print(f"▶  {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, capture_output=False, text=True)
    if check and result.returncode != 0:
        print(f"✗  Command failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def wait_for_postgres(max_retries=30, delay=5):
    """Poll until PostgreSQL is accepting connections."""
    db_url = os.environ.get("CKAN_SQLALCHEMY_URL", "")
    print("⏳ Waiting for PostgreSQL…", flush=True)
    for attempt in range(1, max_retries + 1):
        result = subprocess.run(
            ["python3", "-c",
             f"import sqlalchemy; e=sqlalchemy.create_engine('{db_url}'); e.connect()"],
            capture_output=True
        )
        if result.returncode == 0:
            print("✅ PostgreSQL is ready.", flush=True)
            return
        print(f"   Attempt {attempt}/{max_retries} — retrying in {delay}s…", flush=True)
        time.sleep(delay)
    print("✗  Could not connect to PostgreSQL. Aborting.", file=sys.stderr)
    sys.exit(1)


def main():
    print("\n══════════════════════════════════════════")
    print("  Vigan City Open Data Portal — prerun   ")
    print("══════════════════════════════════════════\n")

    wait_for_postgres()

    # 1. Initialize / upgrade the CKAN database
    print("\n── Step 1: DB init / upgrade ──")
    run(["ckan", "--config=/srv/app/ckan.ini", "db", "upgrade"])

    # 2. Initialize DataStore (creates read-only user + sets permissions)
    print("\n── Step 2: DataStore init ──")
    run(["ckan", "--config=/srv/app/ckan.ini", "datastore", "set-permissions"],
        check=False)

    # 3. Create sysadmin (idempotent — no-ops if already exists)
    sysadmin_name = os.environ.get("CKAN_SYSADMIN_NAME", "vigancity_admin")
    sysadmin_pass = os.environ.get("CKAN_SYSADMIN_PASSWORD", "VCAdmin@2026!")
    sysadmin_email = os.environ.get("CKAN_SYSADMIN_EMAIL", "admin@vigan.gov.ph")

    print(f"\n── Step 3: Ensuring sysadmin '{sysadmin_name}' exists ──")
    check = subprocess.run(
        ["ckan", "--config=/srv/app/ckan.ini", "user", "show", sysadmin_name],
        capture_output=True, text=True
    )
    if "Name:" not in check.stdout:
        run([
            "ckan", "--config=/srv/app/ckan.ini",
            "user", "add", sysadmin_name,
            f"password={sysadmin_pass}",
            f"email={sysadmin_email}"
        ])
        run([
            "ckan", "--config=/srv/app/ckan.ini",
            "sysadmin", "add", sysadmin_name
        ])
        print(f"✅ Sysadmin '{sysadmin_name}' created.", flush=True)
    else:
        print(f"ℹ  Sysadmin '{sysadmin_name}' already exists — skipping.", flush=True)

    print("\n✅ prerun.py complete — handing off to CKAN server.\n")


if __name__ == "__main__":
    main()
