from django.urls import path, include
from djapps.posts.api import (
    ChannelViewset,
    VideoViewset,
    SubscribersViewset,
    FileUploaderAPIView,
    GetUploadToken,
    ListCommentViewSet,
    CommentViewSet
)
from djapps.posts.views import VideoContentDocumentView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("channel", viewset=ChannelViewset, basename="channel")
router.register("videos", viewset=VideoViewset, basename="videos")
router.register('subscribers', viewset=SubscribersViewset, basename="subscribers")
router.register("search", viewset=VideoContentDocumentView, basename="search")



urlpatterns = [
    path("v1/", include(router.urls)),
    path("upload/", FileUploaderAPIView.as_view()),
    path("token/", GetUploadToken.as_view()),
    path("comments/read/", ListCommentViewSet.as_view()),
    path("comments/write/", CommentViewSet.as_view())
]
