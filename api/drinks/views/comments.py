from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from drinks.models import Comment, Recipe
from drinks.serializers import CommentSerializer
from drinks.views.base import LazyViewSet, BookPermission


class CommentPermission(BookPermission):
    def get_book_from_body(self, data):
        recipe_id = data.get('recipe')
        return Recipe.objects.get(pk=recipe_id).book_id

    def get_book_from_obj(self, obj):
        return obj.recipe.book_id

    def check_user_object(self, obj, user):
        return obj.user_id == user.id


class CommentViewSet(LazyViewSet):
    permission_classes = (IsAuthenticated, CommentPermission)
    queryset = Comment.objects.all().order_by('-created')
    serializer_class = CommentSerializer
    filter_fields = {
        'recipe': ['exact'],
        'user': ['exact'],
        'created': ['gt', 'lt'],
    }

    def get_queryset(self):
        queryset = super(CommentViewSet, self).get_queryset()
        permissions = Q(recipe__book__public=True) | \
                      Q(recipe__book__users=self.request.user)
        queryset = queryset.filter(permissions)
        # Set up eager loading to avoid N+1 selects
        if self.request.method == 'GET':
            queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
