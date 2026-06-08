import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from books.models import Book

User = get_user_model()

@pytest.mark.django_db
def test_book_list():
    client = APIClient()
    admin = User.objects.create_user(username="admin", password="admin123", is_admin=True)
    client.force_authenticate(user=admin)

    Book.objects.create(title="Book 1", author="Author 1", price=100)
    Book.objects.create(title="Book 2", author="Author 2", price=200)

    response = client.get("/api/books/")
    assert response.status_code == 200
    assert len(response.data) == 2

@pytest.mark.django_db
def test_book_create_permissions():
    client = APIClient()
    user = User.objects.create_user(username="cust", password="pass", is_admin=False)
    client.force_authenticate(user=user)

    response = client.post("/api/books/", {"title": "Test", "author": "A", "price": 50})
    assert response.status_code == 403