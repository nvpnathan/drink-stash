from django.db.models import ForeignKey, TextField, FloatField, CharField, \
    ManyToManyField, Model, IntegerField, BooleanField, Index, SlugField
from django.contrib.auth.models import User
from django.utils.text import slugify
from .tags import Tag
from .base import DateMixin


class Quantity(Model):
    amount = FloatField()
    unit = ForeignKey('Uom')
    ingredient = ForeignKey('Ingredient')
    hidden = BooleanField(default=False)
    recipe = ForeignKey('Recipe')

    def __str__(self):
        return '%s %s' % (self.amount, self.ingredient)


class Recipe(DateMixin):
    class Meta:
        indexes = [
            Index(fields=['-created']),
            Index(fields=['name']),
            Index(fields=['slug'])
        ]

    name = CharField(max_length=255, unique=True)
    slug = SlugField(unique=True)
    source = CharField(max_length=255)
    directions = TextField(blank=True, null=True)
    description = TextField(blank=True, null=True)

    added_by = ForeignKey(User, blank=True, null=True)
    tags = ManyToManyField(Tag, related_name='recipes')

    def __str__(self):
        return '%s (%s)' % (self.name, self.id)

    def _get_unique_slug(self):
        slug = slugify(self.name)
        if slug.isdigit():
            slug = '_%s' % slug
        existing = Recipe.objects.filter(slug__regex=r'%s-\d+' % slug).count()
        if existing:
            slug = '%s-%d' % (slug, existing + 1)
        return slug

    def save(self, *args, **kwargs):
        # Always do this on save - if the name changes, the slug should change
        self.slug = self._get_unique_slug()
        return super(Recipe, self).save(*args, **kwargs)