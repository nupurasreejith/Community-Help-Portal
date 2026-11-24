from django.contrib import admin
from .models import SharedItem, ItemInterest
# Register your models here.


@admin.register(SharedItem)
class SharedItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description', 'owner__username')


@admin.register(ItemInterest)
class ItemInterestAdmin(admin.ModelAdmin):
    list_display = ('item', 'member', 'created_at')
    search_fields = ('item__title', 'member__username')
