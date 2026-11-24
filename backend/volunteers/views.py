from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import VolunteerProfile
from .serializers import VolunteerProfileSerializer


class VolunteerAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'VOLUNTEER':
            return Response(
                {'error': 'Only volunteers can access this feature.'},
                status=status.HTTP_403_FORBIDDEN
            )

        profile, created = VolunteerProfile.objects.get_or_create(
            volunteer=request.user
        )

        serializer = VolunteerProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        if request.user.role != 'VOLUNTEER':
            return Response(
                {'error': 'Only volunteers can access this feature.'},
                status=status.HTTP_403_FORBIDDEN
            )

        profile, created = VolunteerProfile.objects.get_or_create(
            volunteer=request.user
        )

        serializer = VolunteerProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )