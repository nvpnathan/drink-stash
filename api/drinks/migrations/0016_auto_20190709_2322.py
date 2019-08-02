# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-07-09 23:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


def create_default_book(apps, schema_editor):
    Book = apps.get_model('drinks', 'Book')
    rb = Book.objects.create(
        name='Public Recipes',
        public=True
    )

    BookUser = apps.get_model('drinks', 'BookUser')
    User = apps.get_model('auth', 'User')
    for user in User.objects.iterator():
        public = Book.objects.create(
            name='%s\'s Public Drinks' % user.first_name,
            public=True
        )
        BookUser.objects.create(book=public, user=user, owner=True)
        private = Book.objects.create(
            name='%s\'s Private Drinks' % user.first_name,
            public=False
        )
        BookUser.objects.create(book=private, user=user, owner=True)


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('drinks', '0015_auto_20190329_1638'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('updated', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('name', models.CharField(db_index=True, max_length=255)),
                ('public', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BookUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.BooleanField(default=False)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='drinks.Book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='Book',
            name='users',
            field=models.ManyToManyField(related_name='books', through='drinks.BookUser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.RunPython(create_default_book),
        migrations.AddField(
            model_name='recipe',
            name='book',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='drinks.Book'),
            preserve_default=False,
        ),
    ]