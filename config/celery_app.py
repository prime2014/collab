from celery import Celery
import os
from django.apps import apps


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

app = Celery("djapps")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.task_default_queue = 'celery'
app.conf.task_default_exchange = "celery"
app.conf.task_default_routing_key = 'celery'

app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])
