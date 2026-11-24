from rest_framework import serializers
from .models import SharedItem, ItemInterest


class ItemInterestSerializer(serializers.ModelSerializer):

    member_username = serializers.ReadOnlyField(
        source='member.username'
    )

    class Meta:
        model = ItemInterest
        fields = [
            'id',
            'item',
            'member',
            'member_username',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'member',
            'created_at',
        ]


class SharedItemSerializer(serializers.ModelSerializer):

    owner_username = serializers.ReadOnlyField(
        source='owner.username'
    )

    selected_recipient_username = serializers.ReadOnlyField(
        source='selected_recipient.username'
    )

    interest_count = serializers.SerializerMethodField()

    class Meta:
        model = SharedItem
        fields = [
            'id',
            'owner',
            'owner_username',
            'title',
            'description',
            'image',
            'status',
            'selected_recipient',
            'selected_recipient_username',
            'interest_count',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'owner',
            'status',
            'selected_recipient',
            'selected_recipient_username',
            'created_at',
            'updated_at',
        ]

    def validate_image(self, value):
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

    def get_interest_count(self, obj):
        return obj.interests.count()