from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import EmailValidator, MinValueValidator
from django.contrib.auth.password_validation import validate_password


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, is_active=False, **extra_fields):
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active = is_active,
            **extra_fields
        )
        if password != None:
            validate_password(password=password)
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, first_name, last_name, email, password=None):
        return self.create_user(
            email,
            first_name,
            last_name,
            password,
            is_active=True,
            is_staff=True,
            is_superuser=True
        )


class User(AbstractBaseUser):
    '''A user table'''
    email = models.EmailField(
        unique=True,
        max_length=200,
        null=False,
        validators=[EmailValidator]
    )
    first_name = models.CharField(
        max_length=20,
        null=False
    )
    last_name = models.CharField(
        max_length=20,
        null=False
    )
    avatar = models.ImageField(
        blank=True,
        upload_to="profile",
        width_field = "width",
        height_field = "height",
        null=True
    )
    is_active = models.BooleanField(
        default=False
    )
    is_staff = models.BooleanField(
        default=False
    )
    is_superuser = models.BooleanField(
        default=False
    )
    width = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    height = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )

    USERNAME_FIELD = "email"
    objects = UserManager()

    class Meta:
        ordering = ("id", )

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        if self.is_active:
            return True

    def has_module_perms(self, app_label):
        return self.is_superuser

