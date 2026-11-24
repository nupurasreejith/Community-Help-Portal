
from rest_framework import serializers
from .models import HelpRequest, DispatchAttempt


class HelpRequestSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.username')
    volunteer_username = serializers.ReadOnlyField(
    source='volunteer.username'
)
    offer_expires_at = serializers.SerializerMethodField()

    class Meta:
        model = HelpRequest
        fields = '__all__'
        read_only_fields = [
            'id',
            'user',
            'volunteer',
            'status',
            'created_at',
            'updated_at',
        ]

    def get_offer_expires_at(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return None

        attempt = DispatchAttempt.objects.filter(
            help_request=obj,
            volunteer=request.user,
            status='OFFERED'
        ).first()

        if attempt:
            return attempt.expires_at

        return None
