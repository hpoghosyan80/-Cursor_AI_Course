"""Edge-case password test cases (PWD-E-*)."""

from tests.base import BaseProfileTestCase


class TestPasswordEdge(BaseProfileTestCase):
    def test_PWD_E_001_minimum_password_length(self):
        """PWD-E-001: Password at minimum length (8)."""
        token, data = self.register_and_token()
        resp = self.change_password(
            token,
            {
                "current_password": data["password"],
                "new_password": "Abcd123!",
                "confirm_password": "Abcd123!",
            },
        )
        self.assertEqual(resp.status_code, 200)

    def test_PWD_E_003_rate_limit_password_change(self):
        """PWD-E-003: Rate limit on password change (5/min)."""
        token, data = self.register_and_token()
        for _ in range(5):
            resp = self.change_password(
                token,
                {
                    "current_password": "WrongPass1",
                    "new_password": "NewSecure2",
                    "confirm_password": "NewSecure2",
                },
            )
            self.assertEqual(resp.status_code, 401)
        resp = self.change_password(
            token,
            {
                "current_password": data["password"],
                "new_password": "NewSecure2",
                "confirm_password": "NewSecure2",
            },
        )
        self.assertEqual(resp.status_code, 429)
