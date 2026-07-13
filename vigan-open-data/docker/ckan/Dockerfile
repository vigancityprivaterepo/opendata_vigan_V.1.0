FROM ckan/ckan-base:2.10.10

# Install XLoader and its Python dependencies into the CKAN image.
RUN pip install --no-cache-dir ckanext-xloader \
    && pip install --no-cache-dir -r https://raw.githubusercontent.com/ckan/ckanext-xloader/master/requirements.txt \
    && pip install --no-cache-dir git+https://github.com/DataShades/ckanext-charts.git \
    && pip install --no-cache-dir -U requests[security]

# ── Install the custom Vigan theme extension ─────────────────────────────────
COPY ckan-extensions/ckanext-vigan /srv/app/src_extensions/ckanext-vigan
RUN cd /srv/app/src_extensions/ckanext-vigan \
    && pip install --no-cache-dir -e .

# ── CKAN configuration files ─────────────────────────────────────────────────
COPY docker/ckan/ckan.ini   /srv/app/ckan.ini
COPY docker/ckan/who.ini    /srv/app/who.ini
COPY docker/ckan/setup/prerun.py /srv/app/prerun.py
