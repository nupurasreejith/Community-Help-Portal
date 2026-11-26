
import time

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from help_requests.models import HelpRequest, DispatchAttempt
from help_requests.services import dispatch_to_next_volunteer


class Command(BaseCommand):
    help = 'Process pending help requests and expired volunteer offers'

    def handle(self, *args, **kwargs):
        self.stdout.write('Volunteer dispatch checker started...')

        while True:

            # 1. Process expired offers
            expired_ids = list(
                DispatchAttempt.objects.filter(
                    status='OFFERED',
                    expires_at__lte=timezone.now()
                ).values_list('id', flat=True)
            )

            for attempt_id in expired_ids:
                with transaction.atomic():
                    try:
                        attempt = DispatchAttempt.objects.select_for_update().get(
                            id=attempt_id,
                            status='OFFERED',
                            expires_at__lte=timezone.now()
                        )
                    except DispatchAttempt.DoesNotExist:
                        continue

                    attempt.status = 'EXPIRED'
                    attempt.responded_at = timezone.now()
                    attempt.save()

                    help_request = attempt.help_request

                dispatch_to_next_volunteer(help_request)

                self.stdout.write(
                    f'Request {help_request.id}: Offer expired.'
                )

            # 2. Find pending requests that do not have an active offer
            pending_requests = HelpRequest.objects.filter(
                status='PENDING'
            ).order_by('created_at')

            for help_request in pending_requests:

                active_offer = DispatchAttempt.objects.filter(
                    help_request=help_request,
                    status='OFFERED'
                ).exists()

                if active_offer:
                    continue

                attempt = dispatch_to_next_volunteer(help_request)

                if attempt:
                    self.stdout.write(
                        f'Request {help_request.id}: '
                        f'Offered to {attempt.volunteer.username}.'
                    )

            time.sleep(1)
