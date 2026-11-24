from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from volunteers.models import VolunteerProfile
from .models import HelpRequest, DispatchAttempt, DispatchRotation


User = get_user_model()


def dispatch_to_next_volunteer(help_request):

    with transaction.atomic():

        help_request = HelpRequest.objects.select_for_update().get(
            id=help_request.id
        )

        if help_request.status != 'PENDING':
            return None

        # Check whether another volunteer already has an active offer
        active_attempt = DispatchAttempt.objects.filter(
            help_request=help_request,
            status='OFFERED'
        ).first()

        if active_attempt:
            return None

        # Get volunteers who have already received this request
        attempted_ids = DispatchAttempt.objects.filter(
            help_request=help_request
        ).values_list('volunteer_id', flat=True)

        # Get all available volunteer profiles
        available_profiles = VolunteerProfile.objects.filter(
            is_available=True,
            volunteer__role='VOLUNTEER'
        ).exclude(
            volunteer_id__in=attempted_ids
        ).order_by('volunteer_id')

        volunteers = list(available_profiles)

        if not volunteers:
            return None

        # Get or create the rotation record
        rotation, created = DispatchRotation.objects.get_or_create(
            id=1
        )

        # Find the next volunteer after the previous first-offer recipient
        next_volunteer = None

        for volunteer_profile in volunteers:
            if volunteer_profile.volunteer_id > rotation.last_volunteer_id:
                next_volunteer = volunteer_profile
                break

        # If no higher ID exists, start from the beginning
        if next_volunteer is None:
            next_volunteer = volunteers[0]

        # Update the rotation position
        rotation.last_volunteer_id = next_volunteer.volunteer_id
        rotation.save()

        # Create a 10-second offer
        attempt = DispatchAttempt.objects.create(
            help_request=help_request,
            volunteer=next_volunteer.volunteer,
            expires_at=timezone.now() + timedelta(seconds=10)
        )

        return
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from volunteers.models import VolunteerProfile
from .models import HelpRequest, DispatchAttempt, DispatchRotation


def dispatch_to_next_volunteer(help_request):

    with transaction.atomic():

        help_request = HelpRequest.objects.select_for_update().get(
            id=help_request.id
        )

        if help_request.status != 'PENDING':
            return None

        # Do not create another offer while one is active
        active_attempt = DispatchAttempt.objects.filter(
            help_request=help_request,
            status='OFFERED'
        ).first()

        if active_attempt:
            return None

        # Get all currently available volunteers
        available_profiles = list(
            VolunteerProfile.objects.filter(
                is_available=True,
                volunteer__role='VOLUNTEER'
            ).order_by('volunteer_id')
        )

        if not available_profiles:
            return None

        # Get the round-robin rotation position
        rotation, created = DispatchRotation.objects.get_or_create(id=1)

        # Select the next volunteer after the previous one
        next_volunteer = None

        for profile in available_profiles:
            if profile.volunteer_id > rotation.last_volunteer_id:
                next_volunteer = profile
                break

        # Start again from the first volunteer
        if next_volunteer is None:
            next_volunteer = available_profiles[0]

        rotation.last_volunteer_id = next_volunteer.volunteer_id
        rotation.save()

        # Create a new 10-second offer
        attempt = DispatchAttempt.objects.create(
            help_request=help_request,
            volunteer=next_volunteer.volunteer,
            expires_at=timezone.now() + timedelta(seconds=10)
        )

        return attempt