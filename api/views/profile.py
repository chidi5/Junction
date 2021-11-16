from django.conf import settings
from rest_framework import status, generics, mixins, viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from api import settings as api_settings
from api.serializers.profile import ProfileSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404


from api.models import Profile

User = get_user_model()

# views.py
'''class UserProfileChangeAPIView(generics.RetrieveUpdateAPIView):
	serializer_class = ProfileSerializer
	permission_classes = api_settings.UNPROTECTED

	def get_object(self):
		username = self.kwargs["username"]
		obj = get_object_or_404(Profile, user__username=username)
		return obj
		
class UserProfileChangeAPIView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    lookup_field = 'id'
    serializer_class = ProfileSerializer
    permission_classes = api_settings.UNPROTECTED

class UserIsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.id == request.user.id'''

class UserProfileChangeAPIView(generics.RetrieveAPIView,
                               mixins.DestroyModelMixin,
                               mixins.UpdateModelMixin):

    permission_classes = api_settings.UNPROTECTED

    serializer_class = ProfileSerializer
    #parser_classes = (MultiPartParser, FormParser,)

    def get_object(self):
        username = self.kwargs["username"]
        obj = get_object_or_404(Profile, user__username=username)
        return obj

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)