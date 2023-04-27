from rest_framework import serializers
from djapps.accounts.models import User
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import HyperlinkedModelSerializer



class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class UserSerializer(DynamicFieldsModelSerializer):

    channels = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name="channel-detail"
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "avatar",
            "height",
            "width",
            "is_active",
            "is_staff",
            "is_superuser",
            "channels"
        )

        extra_kwargs = {
            "password": {"write_only": True},
            "is_superuser": {"write_only": True},
            "is_staff": {"write_only": True},
        }

    def validate(self, attrs):
        password = attrs.get("password")
        validate_password(password=password)
        return super().validate(attrs)


    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)
