from django_elasticsearch_dsl import Document, Index,fields
from elasticsearch_dsl import analyzer
from django_elasticsearch_dsl.registries import registry
from djapps.posts.models import VideoContent, Channel
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django_elasticsearch_dsl_drf.compat import StringField, KeywordField




INDEX = Index(settings.ELASTICSEARCH_INDEX_NAMES[__name__])



html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=['lowercase', 'stop', 'snowball'],
    char_filter=['html_strip']
)
@INDEX.doc_type
class ChannelDocument(Document):

    id = fields.TextField(
        attr="id"
    )

    creator = fields.TextField(
        attr="creator_indexing"
    )

    name = fields.TextField(
        fields = {
            "raw": fields.TextField(analyzer="keyword"),
            "suggest": fields.CompletionField()
        }
    )

    description = fields.TextField(
        analyzer=html_strip
    )

    logo = fields.FileField()

    cover_photo = fields.FileField()

    class Django(object):
        model = Channel

    class Index:
        name="channel"
        fields = (
            "id",
            "creator",
            "name",
            "description",
            "logo",
            "cover_photo"
        )

@INDEX.doc_type
class VideoContentDocument(Document):
    """video elasticsearch document"""

    id = fields.TextField(
        attr="id"
    )

    channel = fields.NestedField(
        properties ={
            'id': StringField(
                analyzer=html_strip
            ),
            "name": StringField(
                analyzer=html_strip
            ),
            "logo": fields.FileField(),
            "cover_photo": fields.FileField()
        }
    )

    title = fields.TextField(
        analyzer=html_strip,
        fields = {
            'raw': fields.TextField(analyzer='keyword'),
            "suggest": fields.CompletionField()
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

    thumbnail = fields.FileField()

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

