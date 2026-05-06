FROM ckan/ckan-base:2.10

# ── Install the custom Vigan theme extension ─────────────────────────────────
COPY ckan-extensions/ckanext-vigan /srv/app/src_extensions/ckanext-vigan
RUN cd /srv/app/src_extensions/ckanext-vigan \
    && pip install --no-cache-dir -e .

# ── CKAN configuration files ─────────────────────────────────────────────────
COPY docker/ckan/ckan.ini   /srv/app/ckan.ini
COPY docker/ckan/who.ini    /srv/app/who.ini
COPY docker/ckan/setup/prerun.py /srv/app/prerun.py
