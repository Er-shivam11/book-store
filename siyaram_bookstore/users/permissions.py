# users/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Only allow owners to edit their objects.
    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Allow admin users to edit, others can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user and request.user.is_staff