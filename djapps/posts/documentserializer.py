from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from rest_framework import serializers
from djapps.posts.documents import VideoContentDocument


class VideoDocumentSerializer(DocumentSerializer):

    class Meta:
        document = VideoContentDocument
        fields = (
            "id",
            "channel",
            "title",
            "description",
            "private",
            "video",
            "thumbnail",
            "vid_time",
            "likes",
            "views",
            'pub_date'
        )
