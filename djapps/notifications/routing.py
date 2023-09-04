from django.urls import path
from djapps.notifications.consumers import NotificationsConsumer



websocket_urlpatterns = [
    path("ws/notifications/<str:name>/", NotificationsConsumer.as_asgi())
]
