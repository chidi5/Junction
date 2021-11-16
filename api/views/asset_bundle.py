from django.conf import settings
from rest_framework import status, generics, mixins
from rest_framework.response import Response

from api import settings as api_settings
from api.models import AssetBundle
from api.serializers.asset_bundle import AssetBundleSerializer, AssetBundleDetailSerializer


class AssetBundleList(generics.ListCreateAPIView):
    """
    Item: Create, List
    """

    queryset = AssetBundle.objects.all()
    serializer_class = AssetBundleSerializer

    permission_classes = api_settings.CONSUMER_PERMISSIONS

    def list(self, request):
        self.serializer_class = AssetBundleSerializer
        return super(AssetBundleList, self).list(request)


class AssetBundleDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Location: Read, Write, Delete
    """

    queryset = AssetBundle.objects.all()
    serializer_class = AssetBundleDetailSerializer

    permission_classes = api_settings.CONSUMER_PERMISSIONS

    def retrieve(self, request, pk):
        queryset = self.get_object()
        serializer = AssetBundleDetailSerializer(queryset, many=False)
        return Response(serializer.data)
