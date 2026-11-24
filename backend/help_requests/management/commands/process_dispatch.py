
import time

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from help_requests.models import DispatchAttempt
from help_requests.services import dispatch_to_next_volunteer


class Command(BaseCommand):
    help = 'Process expired volunteer offers'

    def handle(self, *args, **kwargs):
        self.stdout.write('Volunteer dispatch checker started...')

        while True:

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

                    request_id = attempt.help_request_id

                help_request = attempt.help_request

                dispatch_to_next_volunteer(help_request)

                self.stdout.write(
                    f'Request {request_id}: Offer expired. Checking next volunteer.'
                )

            time.sleep(1)
