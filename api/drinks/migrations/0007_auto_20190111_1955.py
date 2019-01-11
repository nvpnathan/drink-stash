# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-01-11 19:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drinks', '0006_ingredient_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='drinks.Recipe'),
        ),
        migrations.AlterField(
            model_name='quantity',
            name='unit',
            field=models.IntegerField(blank=True, choices=[(0, ''), (1, 'oz'), (2, 'dash'), (3, 'barspoon'), (4, 'pinch'), (5, 'teaspoon'), (6, 'tablespoon'), (7, 'sprig'), (8, 'leaf'), (9, 'spritz'), (10, 'wedge')], null=True),
        ),
    ]
