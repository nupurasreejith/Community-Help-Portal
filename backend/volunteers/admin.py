from django.contrib import admin
from .models import VolunteerProfile


@admin.register(VolunteerProfile)
class VolunteerProfileAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'is_available')
    list_filter = ('is_available',)
    search_fields = ('volunteer__username',)