# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-03-16 20:58
from __future__ import unicode_literals

from django.utils.timezone import now
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drinks', '0010_auto_20190314_1410'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='created',
            field=models.DateTimeField(blank=True, default=now)
        ),
    ]
