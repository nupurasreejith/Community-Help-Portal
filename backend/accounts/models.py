from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        MEMBER = 'MEMBER', 'Community Member'
        VOLUNTEER = 'VOLUNTEER', 'Volunteer'
        ORGANIZATION = 'ORGANIZATION', 'Organization'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER
    )

    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.username