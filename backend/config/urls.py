
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)
from django.conf import settings
from django.conf.urls.static import static
from core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/help-requests/', include('help_requests.urls')),
    path('api/volunteers/', include('volunteers.urls')),
    path('api/items/', include('item_sharing.urls')),
    path('', core_views.home, name='home'),
    path('api/events/', include('events.urls')),
    path('api/chatbot/', include('chatbot.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )