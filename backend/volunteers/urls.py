from django.urls import path
from .views import VolunteerAvailabilityView

urlpatterns = [
    path('availability/', VolunteerAvailabilityView.as_view(), name='volunteer-availability'),
]