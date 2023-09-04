from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer
from djapps.posts.models import Channel, VideoContent, Subscribers
from rest_framework import serializers
from django.core.serializers.json import DjangoJSONEncoder
from hashid_field import Hashid
from djapps.posts.models import Comments



class HashidJSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, Hashid):
            return str(o)
        return super().default(o)


class ChannelSerializer(ModelSerializer):
    id = serializers.UUIDField(
        format="hex",
    )
    creator = serializers.ReadOnlyField(
        source="creator.id"
    )
    class Meta:
        model = Channel
        fields = (
            "id",
            "creator",
            "name",
            "description",
            "logo",
            "cover_photo",
            "creation_date"
        )

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)


class SubscriberSerializer(ModelSerializer):
    user = serializers.ReadOnlyField(
        source="user.id"
    )
    class Meta:
        model = Subscribers
        fields = "__all__"

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)


class VideoContentSerializer(ModelSerializer):
    id = serializers.UUIDField(
        format="hex"
    )

    vid_time = serializers.FloatField()

    class Meta:
        model = VideoContent
        fields = (
            "id",
            "channel",
            "description",
            "title",
            "likes",
            "views",
            "state",
            "vid_time",
            "video",
            "thumbnail",
            "private",
            "pub_date"
        )
        read_only_fields = ["video"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result["channel"] = ChannelSerializer(instance=instance.channel).data
        return result

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.state = "PUBLISHED"
        instance.private = False
        instance.save()
        return instance


class CommentSerializer(ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.id"
    )
    class Meta:
        model = Comments
        fields = (
            "id",
            "author",
            "post",
            "comment",
            "flagged",
            "pub_date"
        )

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)


class SubscribersSerializer(ModelSerializer):
    user = serializers.ReadOnlyField(
        source="user.id"
    )
    class Meta:
        model = Subscribers
        fields = (
            "user",
            "channel",
            "date_of_subscription"
        )


    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)
