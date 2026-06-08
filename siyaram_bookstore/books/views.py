from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from django.core.cache import cache
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
import logging

from core.responses import success_response
from users.models import UserEvent

from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer
from .permissions import IsAdminUserOrReadOnly

logger = logging.getLogger(__name__)


# =========================
# PAGINATION
# =========================
class BookPagination(PageNumberPagination):
    page_size = 10


# =========================
# CATEGORY VIEWSET
# =========================
class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


# =========================
# BOOK VIEWSET
# =========================
class BookViewSet(ModelViewSet):
    queryset = Book.objects.filter(
        is_active=True,
        category__is_active=True   # ✅ IMPORTANT FIX
    ).select_related('category').order_by(
        'category__order', '-created_at'   # ✅ stable + sorted
    )

    serializer_class = BookSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = ["author", "price", "category"]
    search_fields = ["title", "author"]
    ordering_fields = ["price", "created_at", "updated_at"]

    pagination_class = BookPagination

    # =========================
    # LIST (WITH CACHE)
    # =========================
    def list(self, request, *args, **kwargs):
        cache_key = f"books_list_{request.get_full_path()}"
        cached = cache.get(cache_key)

        if cached:
            logger.info("Books served from cache")
            return success_response("Books fetched", cached)

        response = super().list(request, *args, **kwargs)

        cache.set(cache_key, response.data, timeout=60 * 3)

        return success_response("Books fetched", response.data)

    # =========================
    # RETRIEVE
    # =========================
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Track user event
        if request.user.is_authenticated:
            UserEvent.objects.create(
                user=request.user,
                event_type="view_book"
            )

        serializer = self.get_serializer(instance)
        return success_response("Book details", serializer.data)

    # =========================
    # CREATE
    # =========================
    def perform_create(self, serializer):
        serializer.save()
        cache.clear()
        logger.info(f"{self.request.user} created a book")

    # =========================
    # UPDATE
    # =========================
    def perform_update(self, serializer):
        serializer.save()
        cache.clear()

    # =========================
    # DELETE
    # =========================
    def perform_destroy(self, instance):
        instance.delete()
        cache.clear()