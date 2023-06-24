import pytest


@pytest.fixture(scope="module")
def generate_user_data():
    return {
        "first_name": "Christina",
        "last_name": "Sanchez",
        "email": "ramirezbecky@example.net",
        "password": "Belindat2014!",
    }



if __name__ == "__main__":
    print(generate_user_data())
