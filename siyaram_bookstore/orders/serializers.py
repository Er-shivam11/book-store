# orders/serializers.py

from rest_framework import serializers
from .models import Order, OrderItem, Payment


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_title", "quantity", "price"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["payment_id", "paid", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    invoice_url = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_amount",
            "status",
            "buyer_name",
            "email",
            "invoice_pdf",
            "invoice_url",
            "created_at",
            "items",
            "payment"
        ]
    def get_invoice_url(self, obj):

        if obj.invoice_pdf:
            return obj.invoice_pdf.url

        return None