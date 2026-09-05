import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create production admin user if it does not exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        mobile = os.getenv("DJANGO_SUPERUSER_MOBILE")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not mobile or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_MOBILE or DJANGO_SUPERUSER_PASSWORD not configured"
                )
            )
            return

        if User.objects.filter(mobile=mobile).exists():
            self.stdout.write("ADMIN ALREADY EXISTS")
            return

        User.objects.create_superuser(
            mobile=mobile,
            password=password
        )

        self.stdout.write(
            self.style.SUCCESS("ADMIN CREATED")
        )