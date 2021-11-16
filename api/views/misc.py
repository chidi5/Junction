from django.conf import settings
from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from rest_framework import status, mixins
from rest_framework.response import Response

from api import settings as api_settings
from api.generics import generics
from api.models import Like, Comment, Item, Follower
from django.contrib.auth.models import User
from api.serializers.item import ItemDetailSerializer
from api.serializers.user import UserSerializer

import json


class LikeItem(generics.CreateAPIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))

        if not 'item_id' in data:
            return Response({'error': 'no item_id in request.'}, status=status.HTTP_400_BAD_REQUEST)

        item = Item.objects.get(pk=data['item_id'])
        '''
        try:
            like = Like()
            like.item = item
            like.owner = request.user
            like.save()
        except IntegrityError:
            return Response({'error': 'this item has already been liked by this user'}, status=status.HTTP_400_BAD_REQUEST)
        '''
        like_obj, created = Like.objects.get_or_create(owner=request.user, item=item)
        if created:
           # code for new user liked item
           like_obj.save()
        else:
           # code for record found with user and tweet so unlike item by like_obj.delete()
           like_obj.delete()


        serializer = ItemDetailSerializer(item, context={'request': self.request},)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentItem(generics.CreateAPIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))

        if not 'item_id' in data:
            return Response({'error': 'no item_id in request.'}, status=status.HTTP_400_BAD_REQUEST)

        if not 'body' in data:
            return Response({'error': 'no body in request.'}, status=status.HTTP_400_BAD_REQUEST)

        item = Item.objects.get(pk=data['item_id'])

        comment = Comment()
        comment.item = item
        comment.body = data['body']
        comment.owner = request.user
        comment.save()

        serializer = ItemDetailSerializer(item, context={'request': self.request},)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowUser(generics.CreateAPIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(pk=data['user_id'])

        current_user = request.user

        if current_user != user:
            Follower.objects.create(follower=request.user, following=user)
        else:
            return Response({'error': 'Cant follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, context={'request': self.request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UnFollowUser(generics.CreateAPIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(pk=data['user_id'])

        following = Follower.objects.filter(follower=request.user, following=user)
        
        if following.exists():
            following.delete()
        else:
            return Response({'error': 'you are not following user'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, context={'request': self.request})
        return Response(serializer.data, status=status.HTTP_200_OK)
