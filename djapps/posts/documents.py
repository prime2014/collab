from django_elasticsearch_dsl import Document, Index,fields
from elasticsearch_dsl import analyzer
from djapps.posts.models import VideoContent, Channel
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder



INDEX = Index(settings.ELASTICSEARCH_INDEX_NAMES[__name__])



html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=['lowercase', 'stop', 'snowball'],
    char_filter=['html_strip']
)


@INDEX.doc_type
class VideoContentDocument(Document):
    """video elasticsearch document"""

    id = fields.TextField(
        attr="id"
    )

    channel = fields.TextField(
        attr="channel_indexing",
        analyzer=html_strip,
        fields={
        'raw': fields.TextField(analyzer='keyword'),
        }
    )

    title = fields.TextField(
        analyzer=html_strip,
        fields = {
            'raw': fields.TextField(analyzer='keyword')
        }
    )

    description = fields.TextField(
        analyzer=html_strip,
        fields = {
            'raw': fields.TextField(analyzer='keyword')
        }
    )

    private = fields.BooleanField()

    video = fields.TextField()

    thumbnail = fields.TextField(
        attr="thumbnail_indexing",
        analyzer=html_strip,
        fields={
        'raw': fields.TextField(analyzer='keyword'),
        }
    )

    vid_time = fields.FloatField()

    likes = fields.IntegerField()

    views = fields.IntegerField()

    pub_date = fields.DateField()

    class Django(object):
        model = VideoContent

    class Index:
        name = "videocontent"
        fields = [
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
        ]

