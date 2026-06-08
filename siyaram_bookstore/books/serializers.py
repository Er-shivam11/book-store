# books/serializers.py
from rest_framework import serializers
from .models import Book, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True, required=False
    )

    class Meta:
        model = Book
        fields = '__all__'

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value

    def validate_author(self, value):
        if not value.strip():
            raise serializers.ValidationError("Author cannot be empty")
        return value
    def validate_file(self, value):
        if value:
            if not value.name.endswith(".pdf"):
                raise serializers.ValidationError("Only PDF files are allowed")
        return value


    def validate_cover(self, value):
        if value:
            if not value.content_type.startswith("image"):
                raise serializers.ValidationError("Invalid image file")
        return value