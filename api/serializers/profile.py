from rest_framework.serializers import ModelSerializer, SerializerMethodField
from api.models import Profile, Follower
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

### Profile

class ProfileSerializer(ModelSerializer):

    """
    Profile Detail Serializer
    """
    #image_url = SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'id',
            'image',
            'bio',
            'location',
            'website_url',
            'portfolio_url',
            'password',
        )
        read_only_fields = ('id',)

    '''def get_image_url(self, obj):
        request = self.context.get("request")
        print(obj.image)
        if obj.image is None:
            pass
        else:
            return request.build_absolute_uri(obj.image.url)'''
    


class UserFollowingSerializer(ModelSerializer):
    """
    User Following Serializer
    """
    class Meta:
        model = User
        fields = (
            'id',
            User.USERNAME_FIELD,
            'first_name',
            'last_name',
        )
        read_only_fields = ('id',)


class FollowingSerializer(ModelSerializer):
    following = SerializerMethodField()
    class Meta:
        model = Follower
        fields = ('id', 'following', 'created')

    def get_following(self, obj):
        data = {'id': obj.following.id, 'username': obj.following.username}
        return data


class FollowersSerializer(ModelSerializer):
    follower = SerializerMethodField()
    class Meta:
        model = Follower
        fields = ('id', 'follower', 'created')

    def get_follower(self, obj):
        data = {'id': obj.follower.id, 'username': obj.follower.username}
        return data
