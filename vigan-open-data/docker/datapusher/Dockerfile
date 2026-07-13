FROM ckan/ckan-base:2.10.10

RUN pip install --no-cache-dir datapusher ckanserviceprovider messytables

RUN python3 -c "from pathlib import Path; p = Path('/usr/lib/python3.10/site-packages/messytables/core.py'); t = p.read_text(); p.write_text(t.replace('from collections import Mapping', 'from collections.abc import Mapping'))"

COPY settings.py /srv/app/datapusher_settings.py

CMD ["datapusher", "/srv/app/datapusher_settings.py"]
