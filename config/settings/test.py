from .base import *


SECRET_KEY = env("SECRET_KEY", default="vt_vxfwjo0z=x@j4+u75qcvm=v)$uv5jw1ffwg9^8clqkty^bi")


INSTALLED_APPS += [
    "corsheaders",
    "django_celery_beat",
    "django_celery_results",
    "rest_framework",
    "debug_toolbar",
    "channels",
    # "django_elasticsearch_dsl",
    # 'django_elasticsearch_dsl_drf',
    "request_token",
    "webpush",
    "video_encoding",
]


DATABASES = {
    "default" : env.db("TEST_POSTGRES_URL")
}

DATABASES["default"]["ATOMIC_REQUESTS"]=True

# ELASTICSEARCH_DSL={
#     'default': {
#         'hosts': 'elasticsearch:9200'
#     },
# }

ELASTICSEARCH_INDEX_NAMES = {
    'djapps.posts.documents': 'video',
}



