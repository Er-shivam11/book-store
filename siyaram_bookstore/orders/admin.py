# orders/admin.py
from django.contrib import admin
from .models import Order, OrderItem, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "quantity", "price")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount", "status", "created_at", "updated_at")  
    # ✅ UPDATED: added updated_at

    list_filter = ("status", "created_at")
    search_fields = ("user__mobile", "email", "buyer_name")  
    # ✅ UPDATED: username → mobile (your system uses mobile)

    readonly_fields = ("created_at", "updated_at")  
    # ✅ UPDATED: timestamps should not be editable

    inlines = [OrderItemInline]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "payment_id", "paid", "created_at", "updated_at")  
    # ✅ UPDATED: added updated_at

    search_fields = ("payment_id",)
    list_filter = ("paid", "created_at")

    readonly_fields = ("created_at", "updated_at")  
    # ✅ UPDATED

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("order")