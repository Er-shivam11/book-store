# books/admin.py
from django.contrib import admin
from .models import Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")  
    # ✅ UPDATED: add timestamps (important for analytics tracking)

    search_fields = ("name",)
    ordering = ("name",)

    readonly_fields = ("created_at", "updated_at")  
    # ✅ UPDATED


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "price", "category", "created_at", "updated_at")  
    # ✅ UPDATED: added updated_at

    list_filter = ("category", "created_at")
    search_fields = ("title", "author")
    ordering = ("-created_at",)

    autocomplete_fields = ("category",)

    readonly_fields = ("created_at", "updated_at")  # already correct ✅