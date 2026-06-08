# core/validators.py
import re
from rest_framework.exceptions import ValidationError


def validate_mobile_number(mobile: str):
    pattern = r"^[6-9]\d{9}$"

    if not re.match(pattern, mobile):
        raise ValidationError(
            {"mobile": "Enter a valid 10-digit mobile number starting with 6-9"}
        )

    return mobile