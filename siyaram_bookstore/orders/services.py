
# orders/services.py
from django.db import transaction
from rest_framework.exceptions import ValidationError
from decimal import Decimal

from .models import Order, OrderItem, Payment
from books.models import Book


@transaction.atomic
def create_order_from_cart(user, cart_items, buyer_name, email):
    if not cart_items:
        raise ValidationError({"cart": "Cart is empty"})

    total_amount = Decimal("0.00")

    validated_items = []

    # =========================
    # 🧮 CALCULATE TOTAL FIRST
    # =========================
    for item in cart_items:
        book_id = item.get("id")
        quantity = item.get("quantity", 1)

        if quantity <= 0:
            raise ValidationError({"quantity": "Must be greater than 0"})

        try:
            book = Book.objects.get(id=book_id, is_active=True)
        except Book.DoesNotExist:
            raise ValidationError({"book": f"Book {book_id} not found"})

        price = Decimal(str(book.price))
        total_amount += price * Decimal(quantity)

        validated_items.append({
            "book": book,
            "quantity": quantity,
            "price": price
        })

    # =========================
    # ✅ CREATE ORDER WITH TOTAL
    # =========================
    order = Order.objects.create(
        user=user,
        buyer_name=buyer_name,
        email=email,
        status="PENDING",
        total_amount=total_amount
    )

    # =========================
    # 📦 CREATE ORDER ITEMS
    # =========================
    for item in validated_items:
        OrderItem.objects.create(
            order=order,
            product=item["book"],
            quantity=item["quantity"],
            price=item["price"]
        )

    # =========================
    # 💳 CREATE PAYMENT
    # =========================
    Payment.objects.create(
        order=order,
        payment_id="FREE_PAYMENT",
        paid=False
    )

    return order