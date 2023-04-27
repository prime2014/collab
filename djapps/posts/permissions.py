from rest_framework.permissions import BasePermission
from rest_framework import permissions
import logging


logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", encoding="utf8")

logger = logging.getLogger(__name__)



class ChannelOwnerOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):
        logger.info("MAIN VIEW: %s" % (view, ) )

        if request.user.id == obj.creator.id:
            return True
        elif request.method in permissions.SAFE_METHODS:
            return True
        else:
            return False


class ResrictPrivateVideosToCreator(BasePermission):

    def has_permission(self, request, view):
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)
