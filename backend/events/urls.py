from django.urls import path

from .views import (
    EventListCreateView,
    OrganizationEventListView,
    EventDetailView,
    EventRegistrationCreateView,
    MyEventRegistrationsView,
    EventRegistrationsView,
    CancelEventRegistrationView,
)

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path('my-events/', OrganizationEventListView.as_view(), name='my-events'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/register/', EventRegistrationCreateView.as_view(), name='event-register'),
    path('my-registrations/', MyEventRegistrationsView.as_view(), name='my-event-registrations'),
    path('<int:pk>/registrations/', EventRegistrationsView.as_view(), name='event-registrations'),
    path('registrations/<int:pk>/cancel/', CancelEventRegistrationView.as_view(), name='cancel-event-registration'),
]