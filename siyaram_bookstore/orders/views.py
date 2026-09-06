# orders/views.py
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from core.responses import success_response, error_response
from users.models import UserEvent
from .models import Order, Payment
from .serializers import OrderSerializer, PaymentSerializer
from .services import create_order_from_cart
from .tasks import generate_invoice_pdf

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by("-created_at")
        return Order.objects.filter(user=user).order_by("-created_at")
    # 


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all().order_by("-created_at")
        return Payment.objects.filter(order__user=user).order_by("-created_at")


class MyOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return success_response("Orders fetched", serializer.data)


class CreateFreeCartOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            order = create_order_from_cart(
                user=request.user,
                cart_items=request.data.get("items", []),
                buyer_name=request.data.get("name"),
                email=request.data.get("email"),
            )

            return success_response(
                "Order created successfully",
                {
                    "order_id": order.id,
                    "total_amount": order.total_amount,
                }
            )

        except Exception as e:
            return error_response("Order creation failed", str(e))


class ConfirmPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.status == "SUCCESS":
            return error_response("Order already completed")

        if not hasattr(order, "payment"):
            return error_response("Payment record not found")

        order.status = "SUCCESS"
        order.save()

        order.payment.paid = True
        order.payment.save()
        generate_invoice_pdf.delay(order.id)
        UserEvent.objects.create(
            user=request.user,
            event_type="purchase",
            metadata={
                "order_id": order.id,
                "amount": str(order.total_amount),
            }
        )

        return success_response("Payment confirmed")