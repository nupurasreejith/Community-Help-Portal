
from django.urls import path
from .views import (
    SharedItemListCreateView,
    MySharedItemsView,
    SharedItemDetailView,
    ItemInterestCreateView,
    ItemInterestListView,
    MarkItemGivenAwayView,
    SelectItemRecipientView,
)

urlpatterns = [
    path('', SharedItemListCreateView.as_view(), name='shared-item-list'),
    path('my-items/', MySharedItemsView.as_view(), name='my-shared-items'),
    path('<int:pk>/', SharedItemDetailView.as_view(), name='shared-item-detail'),
    path('<int:pk>/need/', ItemInterestCreateView.as_view(), name='item-interest-create'),
    path('<int:pk>/interests/', ItemInterestListView.as_view(), name='item-interest-list'),
    path('<int:pk>/select-recipient/', SelectItemRecipientView.as_view(), name='select-item-recipient'),
    path('<int:pk>/given-away/', MarkItemGivenAwayView.as_view(), name='mark-item-given-away'),
]
