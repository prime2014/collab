from rest_framework import pagination
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response



class VideoPagination(LimitOffsetPagination):
    offset_query_param = "offset"
    limit_query_param = 'limit'
    default_limit = 5

    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset, request, view)
