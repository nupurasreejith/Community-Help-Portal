from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer


class EventListCreateView(generics.ListCreateAPIView):

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(
            status='PUBLISHED',
            event_date__gte=timezone.localdate()
        ).order_by('event_date', 'start_time')

    def perform_create(self, serializer):

        if self.request.user.role != 'ORGANIZATION':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                'Only organizations can create events.'
            )

        serializer.save(organization=self.request.user)


class OrganizationEventListView(generics.ListAPIView):

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'ORGANIZATION':
            return Event.objects.none()

        return Event.objects.filter(
            organization=self.request.user
        ).order_by('-created_at')


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ORGANIZATION':
            return Event.objects.filter(
                organization=self.request.user
            )

        return Event.objects.filter(status='PUBLISHED')

    def perform_update(self, serializer):

        if self.request.user.role != 'ORGANIZATION':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                'Only organizations can edit events.'
            )

        serializer.save()

    def perform_destroy(self, instance):

        if self.request.user.role != 'ORGANIZATION':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                'Only organizations can delete events.'
            )

        instance.delete()


class EventRegistrationCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        event = get_object_or_404(
            Event,
            pk=pk,
            status='PUBLISHED'
        )

        if event.event_date < timezone.localdate():
            return Response(
                {'error': 'Registration for past events is not allowed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        role = request.user.role

        if role == 'MEMBER':
            registration_type = 'MEMBER'

        elif role == 'VOLUNTEER':
            registration_type = 'VOLUNTEER'

        else:
            return Response(
                {'error': 'Only members and volunteers can register.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if EventRegistration.objects.filter(
            event=event,
            user=request.user
        ).exists():
            return Response(
                {'error': 'You have already registered for this event.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if registration_type == 'MEMBER':
            if (
                event.max_participants is not None
                and event.registrations.filter(
                    registration_type='MEMBER'
                ).count() >= event.max_participants
            ):
                return Response(
                    {'error': 'Maximum participant limit reached.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if registration_type == 'VOLUNTEER':
            if (
                event.max_volunteers is not None
                and event.registrations.filter(
                    registration_type='VOLUNTEER'
                ).count() >= event.max_volunteers
            ):
                return Response(
                    {'error': 'Maximum volunteer limit reached.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        registration = EventRegistration.objects.create(
            event=event,
            user=request.user,
            registration_type=registration_type
        )

        return Response(
            {
                'message': 'Successfully registered for the event!',
                'registration': EventRegistrationSerializer(
                    registration
                ).data
            },
            status=status.HTTP_201_CREATED
        )


class MyEventRegistrationsView(generics.ListAPIView):

    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.filter(
            user=self.request.user
        ).select_related('event').order_by('-registered_at')


class EventRegistrationsView(generics.ListAPIView):

    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        event = get_object_or_404(
            Event,
            pk=self.kwargs['pk'],
            organization=self.request.user
        )

        return EventRegistration.objects.filter(
            event=event
        ).select_related('user').order_by('-registered_at')


class CancelEventRegistrationView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        registration = get_object_or_404(
            EventRegistration,
            pk=pk,
            user=request.user
        )

        registration.delete()

        return Response(
            {'message': 'Registration cancelled successfully.'},
            status=status.HTTP_200_OK
        )