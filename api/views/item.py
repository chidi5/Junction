from django.conf import settings
from rest_framework import status, generics, mixins, viewsets
from rest_framework.response import Response
from api import settings as api_settings
from api.models import Item
from api.serializers.item import ItemSerializer, ItemDetailSerializer, LeadSerializer, LeadDetailSerializer


class ItemList(generics.ListCreateAPIView):
    """
    Item: Create, List
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    permission_classes = api_settings.CONSUMER_PERMISSIONS

    def list(self, request):
        print (request.user)
        self.serializer_class = ItemSerializer
        return super(ItemList, self).list(request)



class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Location: Read, Write, Delete
    """

    queryset = Item.objects.all()
    serializer_class = ItemDetailSerializer

    permission_classes = api_settings.CONSUMER_PERMISSIONS

    def retrieve(self, request, pk):
        queryset = self.get_object()
        serializer = ItemDetailSerializer(queryset, many=False, context={'request': request})
        return Response(serializer.data)


class LeadList(viewsets.ModelViewSet):
    """
    Item: Create, List
    """

    queryset = Item.objects.all().order_by('-created_at')[:5]
    serializer_class = LeadSerializer

    permission_classes = api_settings.UNPROTECTED


class ItemListUser(generics.ListAPIView):
    serializer_class = LeadDetailSerializer
    permission_classes = api_settings.UNPROTECTED

    def get_queryset(self):
        username = self.kwargs['username']
        return Item.objects.filter(owner__username=username)