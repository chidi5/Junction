# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2020-09-29 10:35
from __future__ import unicode_literals

from django.db import migrations, models
from base.utils import unique_slug_generator

def update_slug(apps, schema_editor):
    Category = apps.get_model('api', 'Category')

    for instance in Category.objects.all():
        if not instance.slug:
            instance.slug = unique_slug_generator(instance, instance.title, instance.slug)
            instance.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_category_slug'),
    ]

    operations = [
        migrations.RunPython(update_slug, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(max_length=200, unique=True),
        ),
    ]