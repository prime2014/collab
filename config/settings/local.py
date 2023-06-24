from .base import *


DEBUG = True

INSTALLED_APPS += [
    "corsheaders",
    "django_celery_beat",
    "django_celery_results",
    "rest_framework",
    "debug_toolbar",
    "channels",
    "django_elasticsearch_dsl",
    'django_elasticsearch_dsl_drf',
    "webpush",
    "video_encoding",
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication"
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated"
    ]
}


ELASTICSEARCH_DSL={
    'default': {
        'hosts': 'elasticsearch:9200'
    },
}

ELASTICSEARCH_INDEX_NAMES = {
    'djapps.posts.documents': 'video',
}
