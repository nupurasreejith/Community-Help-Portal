from rest_framework import serializers
from .models import VolunteerProfile


class VolunteerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = ['id', 'volunteer', 'is_available']
        read_only_fields = ['id', 'volunteer']