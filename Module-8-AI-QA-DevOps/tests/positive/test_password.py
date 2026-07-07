"""Positive password change test cases (PWD-P-*)."""

from tests.base import BaseProfileTestCase


class TestPasswordPositive(BaseProfileTestCase):
    def test_PWD_P_001_change_password_valid(self):
        """PWD-P-001: Change password with valid credentials."""
        token, data = self.register_and_token()
        payload = self.test_data["passwordChange"]["valid"]
        resp = self.change_password(token, payload)
        self.assertEqual(resp.status_code, 200)
        old_login = self.login(data["email"], data["password"])
        self.assertEqual(old_login.status_code, 401)

    def test_PWD_P_002_login_with_new_password(self):
        """PWD-P-002: Login with new password after change."""
        token, data = self.register_and_token()
        payload = self.test_data["passwordChange"]["valid"]
        self.change_password(token, payload)
        resp = self.login(data["email"], payload["new_password"])
        self.assertEqual(resp.status_code, 200)
        self.assertIn("access_token", resp.get_json())

    def test_PWD_P_003_sessions_invalidated_after_change(self):
        """PWD-P-003: All sessions invalidated after password change."""
        token, data = self.register_and_token()
        self.change_password(token, self.test_data["passwordChange"]["valid"])
        resp = self.get_profile(token)
        self.assertEqual(resp.status_code, 401)
