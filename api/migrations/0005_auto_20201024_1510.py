# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2020-10-24 14:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20201024_1502'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(blank=True, default='../frontend/static/frontend/img/profile.gif', null=True, upload_to='images'),
        ),
    ]
