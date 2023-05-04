from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator
import uuid
import redis


class Channel(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4(),
        primary_key=True
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name = "channels"
    )
    name = models.CharField(
        null=False,
        max_length = 100,
        unique=True
    )
    description = models.TextField(
        null=True
    )
    logo = models.ImageField(
        upload_to="channel_logo",
        null=True,
        blank=True
    )
    cover_photo = models.ImageField(
        upload_to="channel",
        null=True,
        blank=True
    )
    creation_date = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    def __str__(self):
        return self.name



class Subscribers(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriber",
    )
    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,
        related_name="subscribed_channel"
    )
    date_of_subscription = models.DateTimeField(
        default = timezone.now,
        editable=False
    )

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} subscribed to {self.channel.name}"


class VideoContent(models.Model):
    STATUS = [
        ("DRAFT", "Draft"),
        ("PUBLISHED", "Published")
    ]
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4()
    )
    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,
        related_name="channel_videos"
    )
    description = models.TextField(
        null=True,
        blank=True
    )
    title = models.CharField(
        max_length=200,
        null=False,
        blank=False
    )

    likes = models.PositiveBigIntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )

    views = models.PositiveBigIntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )

    state = models.CharField(choices=STATUS, default="DRAFT", max_length=30)

    vid_time = models.FloatField(
        null=True
    )

    video = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    thumbnail = models.ImageField(
        upload_to="thumbnail",
        null=True,
        blank=True
    )

    private = models.BooleanField(
        default=True
    )

    pub_date = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    class Meta:
        ordering = ("-pub_date",)

    def __str__(self):
        return self.title

    # The following properties are for customizing elasticsearch fields
    @property
    def indexing_id(self):
        return self.id._hashid

    @property
    def channel_indexing(self):
        if self.channel is not None:
            return self.channel.name

    @property
    def thumbnail_indexing(self):

        if self.thumbnail:
            return self.thumbnail.url



class Comments(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="commentator"
    )
    post = models.ForeignKey(
        VideoContent,
        on_delete=models.CASCADE,
        related_name="post_content"
    )
    comment = models.TextField()
    flagged = models.BooleanField(
        default=False
    )
    
    pub_date = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    def __str__(self):
        return self.comment
