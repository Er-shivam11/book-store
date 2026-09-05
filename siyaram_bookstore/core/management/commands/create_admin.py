import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        mobile = os.getenv("DJANGO_SUPERUSER_MOBILE")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not User.objects.filter(mobile=mobile).exists():
            User.objects.create_superuser(
                mobile=mobile,
                password=password
            )