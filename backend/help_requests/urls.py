
from django.urls import path
from .views import (
    HelpRequestListCreateView,
    HelpRequestDetailView,
    VolunteerRequestListView,
    AcceptRequestView,
    MyAcceptedRequestsView,
    UpdateRequestProgressView,
    RejectRequestView,
    MemberCompleteRequestView,
)

urlpatterns = [
    path('', HelpRequestListCreateView.as_view(), name='help-request-list-create'),
    path('<int:pk>/', HelpRequestDetailView.as_view(), name='help-request-detail'),
    path('volunteer/', VolunteerRequestListView.as_view(), name='volunteer-requests'),
    path('<int:pk>/accept/', AcceptRequestView.as_view(), name='accept-request'),
    path('volunteer/my-requests/', MyAcceptedRequestsView.as_view(), name='my-accepted-requests'),
    path('<int:pk>/progress/', UpdateRequestProgressView.as_view(), name='update-request-progress'),
    path('<int:pk>/reject/', RejectRequestView.as_view(), name='reject-request'),
    path('<int:pk>/complete/', MemberCompleteRequestView.as_view(), name='member-complete-request'),
]
