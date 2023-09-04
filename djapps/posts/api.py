from djapps.posts.models import Channel, VideoContent, Subscribers, Comments
from rest_framework.viewsets import ModelViewSet
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
from django.core.files.storage import Storage, FileSystemStorage
from django.core.files import File
from djapps.posts.serializers import VideoContentSerializer
from djapps.posts.pagination import VideoPagination
import time
from django.db.models import Q
from tinytag import TinyTag
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from django.core.files import File
import random
import string
from djapps.posts.tasks import transcode_720_res, generate_thumbnail
from django.core.exceptions import BadRequest
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from PIL import Image
from django.core.files.storage import FileSystemStorage
from django.db.models import F
import asyncio




SECRET_KEY=env("SECRET_KEY")

User = get_user_model()


logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", level=logging.INFO, encoding="utf8")

logger = logging.getLogger(__name__)

# def generate_thumbnail(file_path, name, secret_token):
#     while not os.path.exists(f"{file_path}"):
#         time.sleep(4)

#     os.system(f"ffmpeg -i {file_path} -ss 00:00:05 -frames:v 1 ./media/thumbnails/{name}_{secret_token}.jpg")
#     return "./media/thumbnails/{name}_{secret_token}.jpg"

# def transcode_video_720(file_path, name, secret_token):
#     while not os.path.exists(f"{file_path}"):
#         time.sleep(4)

#     os.system(f"ffmpeg -i {file_path} -r 25 -crf 30 -vf scale=-iw*a:720 -c:v libvpx-vp9 -b:v 3M -preset faster ./media/videos/720/{name}_{secret_token}_720.webm")
#     return;


# def transcode_video_480(file_path, name, secret_token):
#     while not os.path.exists(f"{file_path}"):
#         time.sleep(4)
#     os.system(f"ffmpeg -i {file_path} -vf scale=iw*a:480 -c:v libvpx-vp9 -b:v 2M  ./media/videos/480/{name}_{secret_token}_480.webm")
#     return;


def transcode_video_360(file_path, name, secret_token):
    while not os.path.exists(f"{file_path}"):
        #sleep at least 4 sec
        time.sleep(4)

    os.system(f"ffmpeg -i {file_path} -vf scale=iw*a:360 -c:v libvpx-vp9 -b:v 1M  ./media/videos/360/{name}_{secret_token}_360.webm")
    return;


class GetUploadToken(APIView):
    authentication_classes = (SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated,)
    serializer_class = VideoSerializer
    parser_classes = (MultiPartParser, FormParser)
    throttle_scope = "upload_token"

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
    throttle_scope = "uploads"

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
        #check for the file
        if request.FILES['file']:
            file  = File(request.FILES["file"], name=file_name)
            file_storage = FileSystemStorage(location="/collab/media/videos/default/")
            name = file_storage.save(file_name, content=file)
            file_path = file_storage.path(name)
            logger.info("TEMPORARY UPLOAD PATH:%s", request.FILES["file"].temporary_file_path())

            file_path = file_path.replace("/collab", "")
            #TODO: distinguish between InMemoryUploader and TemporaryFileUploader
            duration = TinyTag.get(request.FILES['file'].temporary_file_path()).duration
            transcode_task = transcode_720_res.delay(name) #
            result = generate_thumbnail.delay(name)
            # logger.info("THE TRANSCODED TASK ID IS: %s" % transcode_task.request.id)
            logger.info("THIS IS THE RESULT:%s" % result.get())

            video_url = self.request.build_absolute_uri(file_path)
            # the saving of the thumbnail url


            video = VideoContent.objects.create(
                title = "",
                description="",
                channel=self.request.user.channels.first(),
                video=video_url,
                vid_time= duration,
                thumbnail = result.get().replace("/media", "")
            )
            video.save()

            serializers = VideoContentSerializer(instance=video, context={"request": request})
            # logger.info("This is file path: %s" % file_path)

            logger.info("THIS IS FILE URL: %s" % result.get())
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
        random.seed(instance.id) # for reproducability and tracking
        res = ''.join(random.choices((string.ascii_letters + string.digits), k=8))
        if created == True:
            name = str(instance.first_name).lower()
            Channel.objects.create(creator=instance, name=f"{name}{res}")



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
    parser_classes=[MultiPartParser, FormParser, JSONParser]
    pagination_class = VideoPagination

    def get_queryset(self):
        # get a list
        if self.request.query_params.get("channel"):
            channel = self.request.query_params.get("channel")
            videos = VideoContent.objects.filter(Q(channel__id=channel)).select_related("channel")
            return videos
        return self.queryset

    def list(self, request, *args, **kwargs):
        #TODO: Update pgbouncer so that database fetches fresh data
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None and self.request.query_params.get("channel"):
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    async def create(self, request, *args, **kwargs):
        serializer = await self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            await serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):

        if "pic" in request.data:

            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

            path = os.path.join(base_dir, "media", request.data.get("pic"))
            if os.path.exists(path):
                video = self.get_object()
                old_file_url = video.thumbnail.url
                video.thumbnail = request.data.get("pic")
                video.save(update_fields=['thumbnail'])
                os.remove("/collab" + old_file_url)
                request.data.pop("pic")
            else:
                return Response({"detail": "The path to the thumbnail does not exist or the link is broken"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(instance=self.get_object(), data=request.data, partial=True, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], detail=True, authentication_classes=[JWTAuthentication, SessionAuthentication], permission_classes=[IsAuthenticated])
    async def thumbnail(self, request, *args, **kwargs):
        '''Instance for uploading a video thumbnail'''
        storage = FileSystemStorage(location="/collab/media/thumbnails")


        file = File(request.FILES['avatar'], name=request.FILES['avatar'].name)
        file_name = storage.save(request.FILES['avatar'].name, content=file)
        file_path = storage.path(file_name)
        file_path = file_path.replace("/collab", "")
        thumbnail_url = self.request.build_absolute_uri(file_path)
        logger.info("THIS IS FILE PATH:%s" % thumbnail_url)
        logger.info("This is the imge file: %s" % request.FILES['avatar'])
        return Response({"url": thumbnail_url}, status=status.HTTP_200_OK)



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


