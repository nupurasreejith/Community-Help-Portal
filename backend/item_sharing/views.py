
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import SharedItem, ItemInterest
from .serializers import SharedItemSerializer, ItemInterestSerializer


class SharedItemListCreateView(generics.ListCreateAPIView):
    serializer_class = SharedItemSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return SharedItem.objects.filter(
            Q(status='AVAILABLE') |
            Q(status='GIVEN_AWAY', selected_recipient=self.request.user)
        ).select_related(
            'owner', 'selected_recipient'
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MySharedItemsView(generics.ListAPIView):
    serializer_class = SharedItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SharedItem.objects.filter(
            owner=self.request.user
        ).select_related(
            'owner', 'selected_recipient'
        ).order_by('-created_at')


class SharedItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SharedItemSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return SharedItem.objects.filter(owner=self.request.user)


class ItemInterestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        item = get_object_or_404(
            SharedItem,
            pk=pk,
            status='AVAILABLE'
        )

        if item.owner == request.user:
            return Response(
                {'error': 'You cannot express interest in your own item.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        interest, created = ItemInterest.objects.get_or_create(
            item=item,
            member=request.user
        )

        if not created:
            return Response(
                {'message': 'You have already expressed interest in this item.'},
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'message': 'Your interest has been sent to the item owner!',
                'interest_id': interest.id
            },
            status=status.HTTP_201_CREATED
        )


class ItemInterestListView(generics.ListAPIView):
    serializer_class = ItemInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        item = get_object_or_404(
            SharedItem,
            pk=self.kwargs['pk'],
            owner=self.request.user
        )

        return ItemInterest.objects.filter(
            item=item
        ).select_related('member').order_by('-created_at')


class SelectItemRecipientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        member_id = request.data.get('member_id')

        if not member_id:
            return Response(
                {'error': 'Please select a member.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            item = get_object_or_404(
                SharedItem.objects.select_for_update(),
                pk=pk,
                owner=request.user
            )

            if item.status != 'AVAILABLE':
                return Response(
                    {'error': 'This item is no longer available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            interest = ItemInterest.objects.filter(
                item=item,
                member_id=member_id
            ).first()

            if not interest:
                return Response(
                    {'error': 'This member has not expressed interest in this item.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            item.selected_recipient = interest.member
            item.status = 'GIVEN_AWAY'
            item.save()

        return Response({
            'message': 'Recipient selected successfully!',
            'selected_member': interest.member.username,
            'status': item.status
        })


class MarkItemGivenAwayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        return Response(
            {'error': 'Please select an interested member before giving away this item.'},
            status=status.HTTP_400_BAD_REQUEST
        )
