# settings/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "siyaram_bookstore.settings")

app = Celery("siyaram_bookstore")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()