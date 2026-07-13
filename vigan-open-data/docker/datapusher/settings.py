import os

SQLALCHEMY_DATABASE_URI = "sqlite:////var/lib/datapusher/datapusher_jobs.db"
SECRET_KEY = os.environ.get("DATAPUSHER_SECRET_KEY", "change-me-datapusher-secret")
CKAN_URL = os.environ.get("DATAPUSHER_CKAN_URL", "http://ckan:5000")
DATAPUSHER_CALLBACK_URL_BASE = os.environ.get("DATAPUSHER_CALLBACK_URL_BASE", "http://ckan:5000")
URL = os.environ.get("DATAPUSHER_URL", "http://datapusher:8800")
HOST = "0.0.0.0"
PORT = 8800

