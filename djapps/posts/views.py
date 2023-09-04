from django.shortcuts import render
from django_elasticsearch_dsl_drf.constants import (
    LOOKUP_QUERY_CONTAINS,
    LOOKUP_QUERY_STARTSWITH,
    LOOKUP_FILTER_EXISTS,
    FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX,
    FUNCTIONAL_SUGGESTER_COMPLETION_MATCH,
    LOOKUP_FILTER_PREFIX,
    STRING_LOOKUP_FILTERS,
    SUGGESTER_COMPLETION
)
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    IdsFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    CompoundSearchFilterBackend,
    SuggesterFilterBackend,
    HighlightBackend,
    MultiMatchSearchFilterBackend
)

from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from djapps.posts.documents import VideoContentDocument
from djapps.posts.documentserializer import VideoDocumentSerializer


class VideoContentDocumentView(BaseDocumentViewSet):

    document = VideoContentDocument
    pagination_class = PageNumberPagination
    serializer_class = VideoDocumentSerializer
    filter_backends = [
        FilteringFilterBackend,
        IdsFilterBackend,
        OrderingFilterBackend,
        DefaultOrderingFilterBackend,
        CompoundSearchFilterBackend,
        SuggesterFilterBackend,
        HighlightBackend,
        MultiMatchSearchFilterBackend
    ]

    multi_search_fields = (
        "title",
        "channel"
    )

    highlight_fields = {
        "title": {
            'options': {
                'pre_tags': ["<b>"],
                'post_tags': ["</b>"],
            },
            'enabled': True
        }
    }

    search_nested_fields = {
        "channel": {
            "path": "channel",
            "fields": ["name"]
        }
    }

    search_fields = {
        "title": {"fuzziness": "AUTO", "boost": 4},
        "channel": None
    }


    # Define filter fields
    filter_fields = {
        "title": {
            "lookups": [
                LOOKUP_QUERY_CONTAINS,
                LOOKUP_QUERY_STARTSWITH,
                LOOKUP_FILTER_PREFIX
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

    suggester_fields = {
        'title_suggest': {
            'field': 'title.suggest',
            'suggesters': [
                FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
            ],
            'options': {
                'size': 10,
                'skip_duplicates': True
            }
        },
        'channel_suggest' : {
            'field': 'channel.suggest',
            'suggesters': [
                FUNCTIONAL_SUGGESTER_COMPLETION_MATCH
            ]
        }
    }



