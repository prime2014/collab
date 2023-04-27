from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from djapps.accounts.models import User


@registry.register_document
class UserDocument(Document):

    class Index:
        # Name of the elasticsearch index
        name = "users"
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "avatar"
        ]
