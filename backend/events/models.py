from django.db import models
from django.conf import settings


class Event(models.Model):

    CATEGORY_CHOICES = [
        ('HEALTH', 'Health'),
        ('EDUCATION', 'Education'),
        ('FOOD', 'Food Distribution'),
        ('ENVIRONMENT', 'Environment'),
        ('DONATION', 'Donation Drive'),
        ('COMMUNITY', 'Community Activity'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('PUBLISHED', 'Published'),
        ('CANCELLED', 'Cancelled'),
    ]

    organization = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    poster = models.ImageField(upload_to='event_posters/')

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )

    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    venue = models.CharField(max_length=255)
    contact_details = models.CharField(max_length=255)

    max_participants = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    max_volunteers = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PUBLISHED'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class EventRegistration(models.Model):

    REGISTRATION_TYPES = [
        ('MEMBER', 'Member'),
        ('VOLUNTEER', 'Volunteer'),
    ]

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_registrations'
    )

    registration_type = models.CharField(
        max_length=20,
        choices=REGISTRATION_TYPES
    )

    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'user'],
                name='unique_event_user_registration'
            )
        ]

    def __str__(self):
        return f'{self.user} - {self.event.title}'