# orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    OrderViewSet,
    PaymentViewSet,
    MyOrdersAPIView,
    CreateFreeCartOrderAPIView,
    ConfirmPaymentAPIView,
)

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"payments", PaymentViewSet, basename="payments")

urlpatterns = [
    # ViewSets
    path("", include(router.urls)),

    # Custom APIs
    path("my-orders/", MyOrdersAPIView.as_view(), name="my-orders"),
    path("create-order/", CreateFreeCartOrderAPIView.as_view(), name="create-order"),
    path("confirm-payment/<int:order_id>/", ConfirmPaymentAPIView.as_view(), name="confirm-payment"),
]