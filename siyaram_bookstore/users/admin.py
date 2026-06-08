# users/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserEvent

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User

    list_display = ("mobile", "email", "is_staff", "is_superuser", "is_active","created_at", "updated_at")
    list_filter = ("is_staff", "is_superuser", "is_active")

    search_fields = ("mobile", "email")
    ordering = ("mobile",)
    readonly_fields = ("created_at", "updated_at", "last_login")  
    # IMPORTANT: remove username completely
    fieldsets = (
    (None, {"fields": ("mobile", "password")}),
    ("Personal Info", {"fields": ("email", "first_name", "last_name")}),
    ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),  # ✅ FIXED
)

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("mobile", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )
print("ADMIN LOADED")
@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "event_type", "timestamp")  
    # ✅ UPDATED: better visibility

    list_filter = ("event_type", "timestamp")

    search_fields = ("user__mobile",)

    readonly_fields = ("timestamp",)  
