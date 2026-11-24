from django.db import models
from django.conf import settings

# Create your models here.
class HelpRequest(models.Model):

    class Category(models.TextChoices):
        FOOD = 'FOOD', 'Food'
        EDUCATION = 'EDUCATION', 'Education'
        CLOTHING = 'CLOTHING', 'Clothing'
        MEDICAL = 'MEDICAL', 'Medical'
        DAILY_NEEDS = 'DAILY_NEEDS', 'Daily Needs'
        OTHER = 'OTHER', 'Other'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='help_requests'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(
        max_length=20,
        choices=Category.choices
    )
    location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='accepted_help_requests'
    )


class DispatchAttempt(models.Model):

    class Status(models.TextChoices):
        OFFERED = 'OFFERED', 'Offered'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'
        EXPIRED = 'EXPIRED', 'Expired'

    help_request = models.ForeignKey(
        HelpRequest,
        on_delete=models.CASCADE,
        related_name='dispatch_attempts'
    )

    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dispatch_attempts'
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OFFERED
    )

    offered_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    responded_at = models.DateTimeField(null=True, blank=True)

    

    def __str__(self):
        return f"{self.help_request.title} - {self.volunteer.username} - {self.status}"

class DispatchRotation(models.Model):
    last_volunteer_id = models.IntegerField(default=0)

    def __str__(self):
        return f"Last volunteer ID: {self.last_volunteer_id}"