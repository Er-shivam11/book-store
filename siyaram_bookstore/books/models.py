# books/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['order']

class Book(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    author = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="books")
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="books/files/", null=True, blank=True)  # PDF
    cover = models.ImageField(upload_to="books/covers/", null=True, blank=True)  # Cover Image
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["title", "author"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.author}"