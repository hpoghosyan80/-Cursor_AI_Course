"""Utility tests."""

from app.utils.security import sanitize_text
from app.utils.validators import validate_customer_email, validate_subject


class TestUtils:
    def test_sanitize(self, app):
        with app.app_context():
            assert "<b>" not in sanitize_text("<b>hi</b>")

    def test_validate_subject(self):
        assert validate_subject("Valid subject line!") == "Valid subject line!"

    def test_validate_email(self):
        assert validate_customer_email("user@example.com") == "user@example.com"
