from django.shortcuts import render
from django_elasticsearch_dsl_drf.constants import (
    LOOKUP_QUERY_CONTAINS,
    LOOKUP_QUERY_STARTSWITH,
    LOOKUP_FILTER_EXISTS,
    SUGGESTER_COMPLETION,
)
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    IdsFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    CompoundSearchFilterBackend,
    SuggesterFilterBackend,
    HighlightBackend
)

from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from djapps.posts.documents import VideoContentDocument
from djapps.posts.documentserializer import VideoDocumentSerializer


class VideoContentDocumentView(BaseDocumentViewSet):

    document = VideoContentDocument
    pagination_class = PageNumberPagination
    serializer_class = VideoDocumentSerializer
    lookup_field = "id"
    filter_backends = [
        FilteringFilterBackend,
        IdsFilterBackend,
        OrderingFilterBackend,
        DefaultOrderingFilterBackend,
        CompoundSearchFilterBackend,
        SuggesterFilterBackend,
        HighlightBackend
    ]

    multi_search_fields = (
        "title",
        "channel"
    )

    highlight_fields = {
        "title": {
            'enabled': True,
            'options': {
                'pre_tags': ["<b>"],
                'post_tags': ["</b>"],
            }
        }
    }

    search_nested_fields = {
        "channel": {
            "path": "channel",
            "fields": ["id"]
        }
    }

    search_fields = {
        "title": {"fuzziness": "AUTO", "boost": 4},
        "channel": None
    }

    suggester_fields = {
        'title_suggest': {
            'field': 'title.suggest',
            'suggesters': [
                SUGGESTER_COMPLETION
            ],
            'options': {
                'size': 10,
                'skip_duplicates': True
            }
        },
        'channel_suggest' : {
            'field': 'channel.suggest',
            'suggesters': [
                SUGGESTER_COMPLETION
            ]
        }
    }

    # Define filter fields
    filter_fields = {
        "title": {
            "lookups": [
                LOOKUP_QUERY_CONTAINS,
                LOOKUP_QUERY_STARTSWITH
            ]
        },
        "channel": {
            "lookups": [
                LOOKUP_FILTER_EXISTS,
                LOOKUP_QUERY_CONTAINS,
                LOOKUP_QUERY_STARTSWITH
            ]
        }
    }

    ordering_fields = {
        "title": "title.raw",
        "pub_date": "pub_date"
    }



