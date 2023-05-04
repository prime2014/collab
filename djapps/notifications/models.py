from django.db import models
from enum import Enum
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


LEVELS = [
    ('WARNING', 'Warning'),
    ('ERROR', 'Warning'),
    ('INFO', 'Warning'),
    ('SUCCESS', 'Warning'),
]


class Notifications(models.Model):
    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="initiator"
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    level = models.CharField(choices=LEVELS, max_length=30)
    description = models.TextField()
    verb = models.CharField(
        max_length=20,
        null=True
    )
    public = models.BooleanField(
        default=False
    )
    
    pubdate = models.DateTimeField(
        default=timezone.now,
        editable=False
    )
    
