FROM ckan/ckan-base:2.10

# ── System dependencies ──────────────────────────────────────────────────────
USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ── Install the custom Vigan theme extension ─────────────────────────────────
COPY ../ckan-extensions/ckanext-vigan /srv/app/src_extensions/ckanext-vigan
RUN cd /srv/app/src_extensions/ckanext-vigan \
    && pip install --no-cache-dir -e .

# ── CKAN configuration files ─────────────────────────────────────────────────
COPY ckan/ckan.ini   /srv/app/ckan.ini
COPY ckan/who.ini    /srv/app/who.ini
COPY ckan/setup/prerun.py /srv/app/prerun.py

# ── Drop back to the non-root ckan user ──────────────────────────────────────
USER ckan
