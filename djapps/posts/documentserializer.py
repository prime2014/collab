from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from rest_framework import serializers
from djapps.posts.documents import VideoContentDocument, ChannelDocument


class ChannelDocumentSerializer(DocumentSerializer):
    class Meta:
        document = ChannelDocument
        fields = (
            "id",
            "creator",
            "name",
            "description",
            "logo",
            "cover_photo"
        )


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


