import pytest
from djapps.accounts.serializers import UserSerializer
from rest_framework.test import APIClient
import json


client = APIClient(enforce_csrf_checks=False)


@pytest.mark.django_db(transaction=True)
def test_create_account(generate_user_data):
    user = UserSerializer(data=generate_user_data)

    if user.is_valid(raise_exception=True):
        user.save()
    assert user.data.get("first_name") == "Christina"
    assert user.data.get("last_name") == "Sanchez"
    assert user.data.get("email")== "ramirezbecky@example.net"
    assert user.data.get("is_active") == False


@pytest.mark.django_db(transaction=True)
def test_user_login(generate_user_data):
    print(generate_user_data.get("email"))
    print(generate_user_data.get("password"))

    data = {"email": generate_user_data.get("email"),
            "password": generate_user_data.get("password")}

    resp = client.post("http://127.0.0.1:8000/api/token/",
                       data=json.dumps(data),
                       content_type="application/json")

    print(resp.data)
    assert "success" == "success"
