# books/serializers.py
from rest_framework import serializers
from .models import Book, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "price",
            "category",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]