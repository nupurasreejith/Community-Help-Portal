from django.db import models
from django.conf import settings


class VolunteerProfile(models.Model):
    volunteer = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='volunteer_profile'
    )

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.volunteer.username} - Volunteer Profile"