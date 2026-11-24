from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'organization',
        'category',
        'event_date',
        'status',
    )

    list_filter = ('category', 'status', 'event_date')
    search_fields = ('title', 'organization__username')


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'event',
        'user',
        'registration_type',
        'registered_at',
    )

    list_filter = ('registration_type',)
    search_fields = ('event__title', 'user__username')