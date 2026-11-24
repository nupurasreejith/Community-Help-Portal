from django.db import models
from django.conf import settings
# Create your models here.


class SharedItem(models.Model):

    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('GIVEN_AWAY', 'Given Away'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shared_items'
    )
    selected_recipient = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='received_shared_items'
)

    title = models.CharField(max_length=200)

    description = models.TextField()

    image = models.ImageField(
        upload_to='shared_items/'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AVAILABLE'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ItemInterest(models.Model):

    item = models.ForeignKey(
        SharedItem,
        on_delete=models.CASCADE,
        related_name='interests'
    )

    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='item_interests'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['item', 'member'],
                name='unique_member_item_interest'
            )
        ]

    def __str__(self):
        return f'{self.member} needs {self.item.title}'
