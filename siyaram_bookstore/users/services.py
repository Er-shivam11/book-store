# users/services.py
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserEvent

User = get_user_model()


def login_or_register_user(mobile, password):
    mobile = mobile.strip()

    # =========================
    # 1. GET OR CREATE USER
    # =========================
    user = User.objects.filter(mobile=mobile).first()

    # =========================
    # 2. AUTO REGISTER IF NOT EXISTS
    # =========================
    if not user:
        user = User.objects.create_user(
            mobile=mobile,
            password=password,   # IMPORTANT (Django internal)
        )
        user.set_password(password)
        user.save()

        UserEvent.objects.create(user=user, event_type="signup")

    else:
        # =========================
        # 3. VERIFY PASSWORD
        # =========================
        if not user.check_password(password):
            raise ValidationError({"password": "Invalid credentials"})

        UserEvent.objects.create(user=user, event_type="login")

    # =========================
    # 4. GENERATE TOKENS
    # =========================
    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "mobile": user.mobile,
            "is_staff": user.is_staff,
        },
    }