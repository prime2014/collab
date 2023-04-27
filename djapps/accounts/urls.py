from django.urls import path, include
from djapps.accounts.api import UserViewset, GroupViewset, CheckStatus
from rest_framework.routers import DefaultRouter
from djapps.accounts.searches import SearchUsers


router = DefaultRouter()
router.register("users", viewset=UserViewset, basename="users")
router.register("group", viewset=GroupViewset, basename="group")



urlpatterns = [
    path("v1/", include(router.urls)),
    path("v1/searches/users/<str:query>/", SearchUsers.as_view()),
    path("status/", CheckStatus.as_view())
]
