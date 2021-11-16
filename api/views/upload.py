from django.conf import settings

from rest_framework import status, mixins
from rest_framework.response import Response


from api import settings as api_settings
from api.generics import generics
from api.models import Asset, AssetBundle, Item, Category
from api.serializers.item import ItemDetailSerializer
from api.serializers.asset_bundle import AssetBundleDetailSerializer
from base.tasks import resize_and_upload
from django.template.defaultfilters import slugify

#from django.core.cache.backends.base import DEFAULT_TIMEOUT
#from django.views.decorators.cache import cache_page

#from celery import Celery

#from PIL import Image
#from io import BytesIO
import json, base64, string, random, os
#import boto3, PIL

#CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

class UploadImage(generics.CreateAPIView):
    """
    Image Upload View
    """
    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        if not 'file' in data:
            return Response({'error': 'no image/video in request.'}, status=status.HTTP_400_BAD_REQUEST)
        if not 'mime' in data:
            return Response({'error': 'no mime in request.'}, status=status.HTTP_400_BAD_REQUEST)
        if not 'title' in data:
            return Response({'error': 'no title in request.'}, status=status.HTTP_400_BAD_REQUEST)
        if not 'tag' in data:
            return Response({'error': 'no tag in request.'}, status=status.HTTP_400_BAD_REQUEST)
        if not 'body' in data:
            return Response({'error': 'no body in request.'}, status=status.HTTP_400_BAD_REQUEST)
        
        mime = data['mime']
        title = data['title']
        body = data['body']
        tag = data['tag']
        if not mime in ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']:
            return Response({'error': 'mime not accepted. Must be either image/jpeg, image/png, image/gif, video/mp4'}, status=status.HTTP_400_BAD_REQUEST)

        salt = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(16))
        file_string = data['file']
        file_string = file_string.replace('data:%s;base64,' % mime, '')
        #print(file_string)

        # img = Image.open(BytesIO(base64.b64decode(image_string)))
        # aspect = img.width / img.height

        asset_bundle = AssetBundle()
        asset_bundle.salt = salt
        for j in AssetBundle.KIND_CHOICES:
            kinds = j[0]
            if kinds == 'image' and mime != 'video/mp4':
                print(kinds)
                asset_bundle.kind = kinds
                break
            else:
                print(kinds)
                asset_bundle.kind = kinds
        asset_bundle.base_url = settings.S3_BASE_URL
        asset_bundle.owner = request.user
        asset_bundle.save()

        for k in Asset.KIND_CHOICES:
            kind = k[0]

            asset = Asset()
            asset.asset_bundle = asset_bundle
            asset.kind = kind
            asset.processing = True
            for i in Asset.EXTENSION_CHOICES:
                style = i[0]
                if style == 'png' and mime == 'image/png':
                    asset.extension = style
                    break

                elif style == 'gif' and mime == 'image/gif':
                    asset.extension = style
                    break

                elif style == 'jpg' and mime == 'image/jpeg':
                    asset.extension = style
                    break

                elif style == 'jpeg' and mime == 'image/jpeg':
                    asset.extension = style
                    break
                elif style == 'mp4' and mime == 'video/mp4':
                    asset.extension = style
                    break
            
                else:
                    print ("ERROR - mime not handled.")
            asset.save()

            resize_and_upload.delay(file_string, salt, kind, style, asset.id)

        item = Item()
        item.asset_bundle = asset_bundle
        item.owner = request.user
        item.title = title
        item.body = body

        if isinstance(tag, list):
            # finding out categories that not exist in database and creating them
            exist = Category.objects.filter(title__in=tag)
            Category.objects.bulk_create([Category(title=c, slug=slugify(c)) for c in tag if c not in [str(cat) for cat in exist]])

            tools = []
            for i in tag:
                category_obj = Category.objects.get(title=i)
                tools.append(category_obj)

            item.save()
            item.category.add(*tools)

        else:
            cat_obj, created = Category.objects.get_or_create(title=tag)
            if created:
                # code for new category item
                cat_obj.save()
                item.save()
                item.category.add(cat_obj)
            else:
                # code for record found with user and tweet so unlike item by like_obj.delete()
                item.save()
                item.category.add(cat_obj)


        serializer = ItemDetailSerializer(item, context={'request': request},)
        return Response(serializer.data, status=status.HTTP_200_OK)