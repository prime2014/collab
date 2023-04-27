from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
import abc
from djapps.accounts.documents import UserDocument
from django.http import HttpResponse
from djapps.accounts.serializers import UserSerializer
from elasticsearch_dsl import Q
from rest_framework.response import Response
from rest_framework import status


class PaginatedElasticSearchAPIView(APIView, LimitOffsetPagination):
    serializer_class = UserSerializer
    document_class = UserDocument
    offset = 0

    @abc.abstractmethod
    def generate_q_expression(self, query):
        """This method should be overridden
        and return a Q() expression."""

    def get(self, request, query):
        try:
            q = self.generate_q_expression(query)
            search = self.document_class.search().query(q)[:30]
            response = search.execute()
            self.count = response.hits.total.value

            print(f'Found {response.hits.total.value} hit(s) for query: "{query}"')

            # results = self.paginate_queryset(response, request, view=self)
            serializer = self.serializer_class(response, many=True, fields=["id", "first_name", "last_name", "avatar"])
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return HttpResponse(e, status=500)


class SearchUsers(PaginatedElasticSearchAPIView):

    def generate_q_expression(self, query):
        return Q('bool',
                 should=[
                     Q('match', first_name=query),
                     Q('match', last_name=query),
                 ], minimum_should_match=1)
