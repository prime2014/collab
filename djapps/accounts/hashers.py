from django.contrib.auth.hashers import PBKDF2PasswordHasher


class MYPBKDF2PasswordHasher(PBKDF2PasswordHasher):
    """
    A subclass of PBKDF2PasswordHasher that uses 500 times more iterations.
    """
    iterations = PBKDF2PasswordHasher.iterations * 500