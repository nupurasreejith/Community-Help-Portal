from rest_framework import serializers
from .models import Event, EventRegistration


class EventSerializer(serializers.ModelSerializer):
    organization_username = serializers.ReadOnlyField(
        source='organization.username'
    )
    member_count = serializers.SerializerMethodField()
    volunteer_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'organization',
            'organization_username',
            'title',
            'description',
            'poster',
            'category',
            'event_date',
            'start_time',
            'end_time',
            'venue',
            'contact_details',
            'max_participants',
            'max_volunteers',
            'status',
            'member_count',
            'volunteer_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'organization',
            'status',
            'created_at',
            'updated_at',
        ]

    def validate_poster(self, value):
        if value:
            allowed_types = [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/gif',
            ]

            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    'Only JPG, JPEG, PNG, WEBP and GIF images are allowed.'
                )

        return value

    def get_member_count(self, obj):
        return obj.registrations.filter(
            registration_type='MEMBER'
        ).count()

    def get_volunteer_count(self, obj):
        return obj.registrations.filter(
            registration_type='VOLUNTEER'
        ).count()


class EventRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    event_details = EventSerializer(source='event', read_only=True)

    class Meta:
        model = EventRegistration
        fields = [
            'id',
            'event',
            'event_details',
            'user',
            'username',
            'registration_type',
            'registered_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'registered_at',
        ]