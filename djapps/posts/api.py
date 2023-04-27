from rest_framework.viewsets import ModelViewSet
from djapps.posts.models import Channel, VideoContent, Subscribers, Comments
from rest_framework import status
from rest_framework.response import Response
from djapps.posts.serializers import ChannelSerializer, SubscriberSerializer, CommentSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import logging
from djapps.posts.permissions import ChannelOwnerOrReadOnly
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
import jwt
from config.settings.base import env
from rest_framework.exceptions import ParseError
from django.utils import timezone
from datetime import datetime
from djapps.posts.utils import validate_jwt_token
from djapps.posts.forms import VideoSerializer
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
import os
from django.http import StreamingHttpResponse
from django.core.cache import cache
from djapps.posts.serializers import VideoContentSerializer
from djapps.posts.pagination import VideoPagination
from moviepy.editor import *
import time
from django.db.models import Q
from tinytag import TinyTag
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView




SECRET_KEY=env("SECRET_KEY")

User = get_user_model()


logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", level=logging.INFO, encoding="utf8")

logger = logging.getLogger(__name__)



class GetUploadToken(APIView):
    authentication_classes = (SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated,)
    serializer_class = VideoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        '''These api method is used to generate an upload token for an authenticated user'''
        try:
            timestamp = datetime.utcfromtimestamp(timezone.now().timestamp() + 1800)
            logger.info("MY TIMESTAMP: %s" % timestamp)

            encoded_jwt = jwt.encode({"method": "POST", "x_trust": request.user.id, "exp": timestamp }, SECRET_KEY)
        except ParseError:
            raise ParseError(detail='The token could not be parsed correctly')
        else:
            return Response({"token": encoded_jwt}, status=status.HTTP_200_OK)


class FileUploaderAPIView(APIView):
    authentication_classes = (SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated,)
    serializer_class = VideoSerializer
    parser_classes = (MultiPartParser, FormParser)
    MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "media")
    VIDEO_DIR = os.path.join(MEDIA_DIR, "videos")


    def get(self, request, *args, **kwargs):
        '''These api method is used to generate an upload token for an authenticated user'''
        try:
            timestamp = datetime.utcfromtimestamp(timezone.now().timestamp() + 1800)
            logger.info("MY TIMESTAMP: %s" % timestamp)

            encoded_jwt = jwt.encode({"method": "POST", "x_trust": request.user.id, "exp": timestamp }, SECRET_KEY, algorithm="HS256")
        except ParseError:
            raise ParseError(detail='The token could not be parsed correctly')
        else:
            return Response({"token": encoded_jwt}, status=status.HTTP_204_NO_CONTENT)

    @validate_jwt_token
    def post(self, request, *args, **kwargs):

        file_name: str = request.FILES["file"].name


        if request.FILES['file']:
            file_path = str("./" + "media" + "/" + "videos" + "/" + "default" + "/" + f"{file_name}")

            with open(file_path, "ab") as fp:
                for chunk in request.FILES['file'].chunks():
                    fp.write(chunk)

            name, ext = file_name.split(".")
            secret_token = str(int(time.time()))
            os.system(f"ffmpeg -i {file_path} -ss 00:00:05 -preset veryfast -crf 22 -frames:v 1 ./media/thumbnails/{name}_{secret_token}.jpg")
            duration = TinyTag.get(file_path).duration
            url = self.request.build_absolute_uri(f"/media/videos/default/{file_name}/")
            video = VideoContent.objects.create(
                title = "",
                description="",
                channel=self.request.user.channels.first(),
                video=url,
                vid_time= duration,
                thumbnail = f"/thumbnails/{name}_{secret_token}.jpg"
            )

            serializers = VideoContentSerializer(instance=video, context={"request": request})
            return Response(serializers.data, status=status.HTTP_201_CREATED)



class ChannelViewset(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    authentication_classes = (JWTAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticatedOrReadOnly, ChannelOwnerOrReadOnly)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer=serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        channel_pk = kwargs.get('pk')
        channel: dict = cache.get(f"channel:{channel_pk}")
        if channel:
            return Response(channel, status=status.HTTP_200_OK)
        else:
           serializer = self.serializer_class(instance = self.get_object())
           cache.set(f"channel:{channel_pk}", serializer.data, timeout=3600)
           return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(), data=request.data, partial=True)
        channel_pk = kwargs.get("pk")
        cache.delete(f"channel:{channel_pk}")
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            cache.set(f"channel:{channel_pk}", serializer.data, timeout=3600)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        return StreamingHttpResponse()

    @staticmethod
    @receiver(post_save, sender=User)
    def create_channel(sender, instance, created, **kwargs):
        if created == True:
            name = str(instance.first_name + instance.last_name).lower()
            Channel.objects.create(creator=instance, name=f"@{name}")



class SubscribersViewset(ModelViewSet):
    queryset = Subscribers.objects.all()
    serializer_class = SubscriberSerializer
    authentication_classes = (JWTAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer=serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class VideoViewset(ModelViewSet):
    queryset = VideoContent.objects.filter(Q(state="PUBLISHED") & Q(private=False)).select_related("channel")
    serializer_class = VideoContentSerializer
    authentication_classes = (JWTAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    pagination_class = VideoPagination

    def get_queryset(self):
        if self.request.query_params.get("channel"):
            channel = self.request.query_params.get("channel")
            return VideoContent.objects.filter(Q(channel_id=channel)).select_related("channel")
        return self.queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None and self.request.query_params.get("channel"):
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(), data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ListCommentViewSet(ListAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (JWTAuthentication, SessionAuthentication)
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)



class CommentViewSet(CreateAPIView, UpdateAPIView, DestroyAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (JWTAuthentication, SessionAuthentication)
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(), data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


