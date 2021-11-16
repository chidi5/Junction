# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery import shared_task

from django.conf import settings

from api.models import Asset

#from base.celery import app
#from celery.decorators import task

from PIL import Image
from io import BytesIO
import json, base64, string, random, os
import boto3, PIL, tempfile
from moviepy.editor import *

@shared_task
def resize_and_upload(file_string, salt, kind, style, asset_id):

    if style != 'mp4':
        img = Image.open(BytesIO(base64.b64decode(file_string)))
        aspect = img.width // img.height

        print (kind)
        print(style)
        print ("!!!!!")

        width = 0
        height = 0
        resized_img = None
        if kind == 'original':
            print ("ORIGINAL")
            width = img.width
            height = img.height
            resized_img = img.resize((width, height), PIL.Image.ANTIALIAS)

        elif kind == 'large':
            print ("LARGE")
            width = 1024
            height = aspect * 1024
            resized_img = img.resize((width, height), PIL.Image.ANTIALIAS)

        elif kind == 'small':
            print ("SMALL")
            width = 128
            height = aspect * 128
            resized_img = img.resize((width, height), PIL.Image.ANTIALIAS)

        else:
            print ("ERROR - size not handled.")

        filename = '%s_%s.%s' % (salt, kind, style)
        temp_location = '%s%s' % (settings.TEMP_DIR, filename)
        resized_img.save(temp_location)

        s3_client = boto3.client('s3')
        s3_client.upload_file(temp_location, settings.S3_BUCKET, 'image/%s' % filename)

        s3_resource = boto3.resource('s3')
        object_acl = s3_resource.ObjectAcl(settings.S3_BUCKET, 'image/%s' % filename)
        response = object_acl.put(ACL='public-read')

    else:
        vid = base64.b64decode(file_string)
        temp_path = tempfile.gettempdir()
        temp_loc = temp_path+'\\'+salt+'.'+style
        with open(temp_loc, 'wb') as vfile:
            vfile.write(vid)
        
        clip = VideoFileClip(temp_loc)

        print (kind)
        print(style)
        print ("!!!!!")

        width = 0
        height = 0
        clip_resized = None
        clip1 = None
        if kind == 'original':
            print ("ORIGINAL")
            width = clip.w
            height = clip.h
            clip_resized = clip

        elif kind == 'large':
            print ("LARGE")
            clip1 = clip.resize(width=1024)
            width = clip1.w
            height = clip1.h
            clip_resized = clip1

        elif kind == 'small':
            print ("SMALL")
            clip1 = clip.resize(width=128)
            width = clip1.w
            height = clip1.h
            clip_resized = clip1

        else:
            print ("ERROR - size not handled.")

        filename = '%s_%s.%s' % (salt, kind, style)
        temp_location = '%s%s' % (settings.TEMP_DIR, filename)
        clip_resized.write_videofile(temp_location, logger=None)
        clip_resized.close()
        '''
        fh = open(temp_location, 'wb')
        fh.write(vid)
        #cap = cv2.VideoCapture(temp_location)
        fh.close()'''

        s3_client = boto3.client('s3')
        s3_client.upload_file(temp_location, settings.S3_BUCKET, 'video/%s' % filename)

        s3_resource = boto3.resource('s3')
        object_acl = s3_resource.ObjectAcl(settings.S3_BUCKET, 'video/%s' % filename)
        response = object_acl.put(ACL='public-read')

    asset = Asset.objects.get(pk=asset_id)
    asset.width = width
    asset.height = height
    asset.processing = False
    asset.save()

    os.remove(temp_location)

'''
@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)
'''
