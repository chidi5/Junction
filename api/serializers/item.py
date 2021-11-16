from rest_framework.fields import CurrentUserDefault
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField

from api.models import Item, Like
from api.serializers.user import UserSerializer
from api.serializers.asset_bundle import AssetBundleDetailSerializer


class ItemSerializer(ModelSerializer):

    """
    Item Detail Serializer
    """
    #owner = PrimaryKeyRelatedField(read_only=True, default=CurrentUserDefault())
    owner = UserSerializer(many=False, read_only=True)
    asset_bundle = AssetBundleDetailSerializer(many=False, read_only=True)
    is_liked = SerializerMethodField()

    def get_is_liked(self, obj):
        '''
        Returns a boolean that represents whether the book has 
        already been liked by the user
        '''
        return Like.objects.filter(
            item=obj, 
            owner=self.context['request'].user
        ).exists()

    class Meta:
        model = Item
        fields = (
            'id',
            'asset_bundle',
            'owner',
            'title',
            'get_category',
            'total_likes',
            'is_liked',
            'total_comments',
            'created_at',
        )
        read_only_fields = ('id', 'is_liked',)




class ItemDetailSerializer(ModelSerializer):

    """
    Item Detail Serializer
    """

    owner = UserSerializer(many=False, read_only=True)
    asset_bundle = AssetBundleDetailSerializer(many=False, read_only=True)
    is_liked = SerializerMethodField()

    def get_is_liked(self, obj):
        '''
        Returns a boolean that represents whether the book has 
        already been liked by the user
        '''
        return Like.objects.filter(
            item=obj, 
            owner=self.context['request'].user
        ).exists()

    class Meta:
        model = Item
        fields = (
            'id',
            'asset_bundle',
            'owner',
            'title',
            'body',
            'get_category',
            'total_likes',
            'likes',
            'is_liked',
            'total_comments',
            'comments',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'is_liked',)

   

class LeadSerializer(ModelSerializer):
    owner = UserSerializer(many=False, read_only=True)
    asset_bundle = AssetBundleDetailSerializer(many=False, read_only=True)

    class Meta:
        model = Item
        fields = (
            'id',
            'asset_bundle',
            'owner',
            'title',
            'body',
            'total_likes',
            'total_comments',
            'created_at',
        )
        read_only_fields = ('id',)


class LeadDetailSerializer(ModelSerializer):

    """
    Item Detail Serializer
    """

    owner = UserSerializer(many=False, read_only=True)
    asset_bundle = AssetBundleDetailSerializer(many=False, read_only=True)
    
    class Meta:
        model = Item
        fields = (
            'id',
            'asset_bundle',
            'owner',
            'title',
            'body',
            'get_category',
            'total_likes',
            'likes',
            'total_comments',
            'comments',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id',)