from django.conf.urls import include, url
#from .views import item
#from .views import asset_bundle
#from .views import upload
#from .views import misc
from rest_framework import routers
from .views.item import ItemList, ItemDetail, LeadList, ItemListUser
from .views.asset_bundle import AssetBundleList, AssetBundleDetail
from .views.upload import UploadImage
from .views.misc import LikeItem, CommentItem, FollowUser, UnFollowUser
from.views.profile import UserProfileChangeAPIView
from api.auth import urls as auth_urls

router = routers.DefaultRouter()
router.register(r'leads', LeadList, 'leads')

urlpatterns = [
    url(r'^auth/', include(auth_urls)),
    url(r'^items/?$', ItemList.as_view(), name='item-list'),
    url(r'^items/(?P<pk>[0-9]+)/?$', ItemDetail.as_view(), name='item-detail'),
    url(r'^items/(?P<username>\w+)/profile/?$', ItemListUser.as_view()),
    url(r'^asset-bundles/?$', AssetBundleList.as_view(), name='asset-bundles-list'),
    url(r'^asset-bundles/(?P<pk>[0-9]+)/?$', AssetBundleDetail.as_view(), name='asset-bundles-detail'),
    url(r'^media/item/?$', UploadImage.as_view(), name='upload'),
    url(r'^like/?$', LikeItem.as_view(), name='like'),
    url(r'^comment/?$', CommentItem.as_view(), name='comment'),
    url(r'^follow/?$', FollowUser.as_view(), name='follow'),
    url(r'^unfollow/?$', UnFollowUser.as_view(), name='unfollow'),
    url(r'^edit/(?P<username>\w+)/profile/?$', UserProfileChangeAPIView.as_view()),
    #url(r'^edit/(?P<id>\d+)/profile/?$', UserProfileChangeAPIView.as_view(), name='edit-profile'),
    url(r'^', include(router.urls)),
]
