# books/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import BookViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="books")
router.register(r'categories', CategoryViewSet, basename='categories')

urlpatterns = [
    path("", include(router.urls)),

]