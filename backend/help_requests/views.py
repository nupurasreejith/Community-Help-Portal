from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import HelpRequest
from .serializers import HelpRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

# Create your views here.
class HelpRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HelpRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        help_request = serializer.save(user=self.request.user)

        from .services import dispatch_to_next_volunteer

        dispatch_to_next_volunteer(help_request)

class HelpRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HelpRequest.objects.filter(user=self.request.user)

class IsVolunteer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'VOLUNTEER'
        )



class VolunteerRequestListView(generics.ListAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [IsVolunteer]

    def get_queryset(self):
        return HelpRequest.objects.filter(
            status='PENDING',
            dispatch_attempts__volunteer=self.request.user,
            dispatch_attempts__status='OFFERED',
            dispatch_attempts__expires_at__gt=timezone.now()
        ).distinct()


class AcceptRequestView(APIView):
    permission_classes = [IsVolunteer]

    def post(self, request, pk):
        from django.db import transaction
        from django.utils import timezone
        from .models import DispatchAttempt

        with transaction.atomic():

            try:
                help_request = HelpRequest.objects.select_for_update().get(
                    pk=pk,
                    status='PENDING'
                )

                attempt = DispatchAttempt.objects.select_for_update().get(
                    help_request=help_request,
                    volunteer=request.user,
                    status='OFFERED'
                )

            except (HelpRequest.DoesNotExist, DispatchAttempt.DoesNotExist):
                return Response(
                    {'error': 'This request is not currently offered to you.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            if attempt.expires_at <= timezone.now():
                attempt.status = 'EXPIRED'
                attempt.responded_at = timezone.now()
                attempt.save()

                return Response(
                    {'error': 'Your 10-second acceptance time has expired.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            attempt.status = 'ACCEPTED'
            attempt.responded_at = timezone.now()
            attempt.save()

            help_request.volunteer = request.user
            help_request.status = 'ACCEPTED'
            help_request.save()

        return Response({
            'message': 'Help request accepted successfully!',
            'request_id': help_request.id,
            'status': help_request.status
        })
class MyAcceptedRequestsView(generics.ListAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [IsVolunteer]

    def get_queryset(self):
        return HelpRequest.objects.filter(
            volunteer=self.request.user
        ).exclude(status='CANCELLED')

class UpdateRequestProgressView(APIView):
    permission_classes = [IsVolunteer]

    def patch(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(
                pk=pk,
                volunteer=request.user
            )
        except HelpRequest.DoesNotExist:
            return Response(
                {'error': 'Request not found or not assigned to you.'},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')

        if new_status not in ['IN_PROGRESS', 'COMPLETED']:
            return Response(
                {'error': 'Invalid status.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if help_request.status not in ['ACCEPTED', 'IN_PROGRESS']:
            return Response(
                {'error': 'This request cannot be updated.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        help_request.status = new_status
        help_request.save()

        return Response({
            'message': 'Request progress updated successfully!',
            'request_id': help_request.id,
            'status': help_request.status
        })
class RejectRequestView(APIView):
    permission_classes = [IsVolunteer]

    def post(self, request, pk):
        from django.utils import timezone
        from .models import DispatchAttempt
        from .services import dispatch_to_next_volunteer

        try:
            attempt = DispatchAttempt.objects.get(
                help_request_id=pk,
                volunteer=request.user,
                status='OFFERED'
            )
        except DispatchAttempt.DoesNotExist:
            return Response(
                {'error': 'No active offer found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        attempt.status = 'REJECTED'
        attempt.responded_at = timezone.now()
        attempt.save()

        next_attempt = dispatch_to_next_volunteer(attempt.help_request)

        if next_attempt:
            message = 'Request rejected. It has been offered to the next volunteer.'
        else:
            message = 'Request rejected. No other available volunteers were found.'

        return Response({'message': message})


class MemberCompleteRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(
                pk=pk,
                user=request.user
            )
        except HelpRequest.DoesNotExist:
            return Response(
                {'error': 'Help request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if help_request.status not in ['ACCEPTED', 'IN_PROGRESS']:
            return Response(
                {'error': 'Only an accepted request can be completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not help_request.volunteer:
            return Response(
                {'error': 'No volunteer has accepted this request.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        help_request.status = 'COMPLETED'
        help_request.save()

        return Response({
            'message': 'Help request marked as completed!',
            'request_id': help_request.id,
            'status': help_request.status
        })
