"""
api.serializers.user
~~~~~~~~~~
"""
from rest_framework.fields import CurrentUserDefault
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from api.models import Follower
from api.serializers.profile import ProfileSerializer, FollowingSerializer, FollowersSerializer


User = get_user_model()

class UserSerializer(ModelSerializer):
    """
    User Serializer
    """

    profile = ProfileSerializer(many=False)

    following = SerializerMethodField()
    followers = SerializerMethodField()


    groups = SerializerMethodField('get_user_groups')
    def get_user_groups(self, user):
        results = []
        for group in user.groups.all():
            results.append(group.name)

        return results


    class Meta:
        model = User
        fields = (
            'id',
            User.USERNAME_FIELD,
            'first_name',
            'last_name',
            'email',
            'profile',
            'followers',
            'following',
            'groups',
        )
        read_only_fields = (
            'id',
            'groups',
            'profile',
            'followers',
            'following',
        )

    def get_following(self, obj):
        return FollowingSerializer(obj.following.all(), many=True).data
        '''results = []
        for follow in Follower.objects.filter(follower=self.context['request'].user):
            results.append(follow.following.username)
        return results'''

    def get_followers(self, obj):
        return FollowersSerializer(obj.followers.all(), many=True).data

    
class UserDetailSerializer(UserSerializer):
    """
    User Detail Serializer
    """


    class Meta:
        model = User
        fields = (
            'id',
            User.USERNAME_FIELD,
            'first_name',
            'last_name',
            'email',
            'groups',
        )
        read_only_fields = fields


class UserListSerializer(UserSerializer):
    """
    User List Serializer
    """

    class Meta:
        model = User
        fields = (
            'id',
            User.USERNAME_FIELD,
            'first_name',
            'last_name',
            'email',
        )
        read_only_fields = fields