# users/views.py
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from core.responses import success_response, error_response
from .services import User, login_or_register_user
from django.contrib.auth.password_validation import validate_password
from .serializers import UserProfileSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile = request.data.get("mobile")
        password = request.data.get("password")

        if not mobile or not password:
            return error_response(
                message="Mobile and password required",
                status_code=400,
            )

        try:
            data = login_or_register_user(mobile, password)
            return success_response("Login successful", data)

        except Exception as e:
            return error_response(
                message="Authentication failed",
                errors=str(e),
                status_code=400,
            )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                pass  # 🔥 ignore invalid/expired token

        # ✅ ALWAYS SUCCESS
        return success_response("Logout successful")

class SimpleResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        mobile = request.data.get("mobile")
        new_password = request.data.get("password")

        if not mobile or not new_password:
            return error_response("Mobile and password required")

        try:
            user = User.objects.get(mobile=mobile)
        except User.DoesNotExist:
            return error_response("User not found")

        # validate password strength
        validate_password(new_password, user)

        # overwrite password
        user.set_password(new_password)
        user.save()

        return success_response("Password updated successfully")


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return success_response(
            message="Profile fetched",
            data=serializer.data
        )

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return success_response(
                message="Profile updated successfully",
                data=serializer.data
            )

        return error_response(
            message="Validation failed",
            errors=serializer.errors,
            status_code=400
        )