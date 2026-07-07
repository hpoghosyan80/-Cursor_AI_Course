"""Negative password change test cases (PWD-N-*)."""

from tests.base import BaseProfileTestCase


class TestPasswordNegative(BaseProfileTestCase):
    def test_PWD_N_001_wrong_current_password(self):
        """PWD-N-001: Reject wrong current password."""
        token, _ = self.register_and_token()
        resp = self.change_password(
            token,
            self.test_data["passwordChange"]["wrongCurrent"],
        )
        self.assertEqual(resp.status_code, 401)

    def test_PWD_N_002_mismatched_confirm(self):
        """PWD-N-002: Reject mismatched confirm password."""
        token, _ = self.register_and_token()
        resp = self.change_password(
            token,
            self.test_data["passwordChange"]["mismatchedConfirm"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_PWD_N_003_same_as_current(self):
        """PWD-N-003: Reject new password same as current."""
        token, _ = self.register_and_token()
        resp = self.change_password(
            token,
            self.test_data["passwordChange"]["sameAsCurrent"],
        )
        self.assertEqual(resp.status_code, 400)

    def test_PWD_N_004_weak_new_password(self):
        """PWD-N-004: Reject weak new password."""
        token, _ = self.register_and_token()
        resp = self.change_password(
            token,
            self.test_data["passwordChange"]["weakNewPassword"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_PWD_N_005_unauthenticated(self):
        """PWD-N-005: Reject unauthenticated password change."""
        resp = self.client.put(
            "/api/users/me/password",
            json=self.test_data["passwordChange"]["valid"],
        )
        self.assertEqual(resp.status_code, 401)

    def test_PWD_N_006_missing_current_password(self):
        """PWD-N-006: Reject missing current_password."""
        token, _ = self.register_and_token()
        resp = self.change_password(token, {"new_password": "NewSecure2"})
        self.assertEqual(resp.status_code, 422)

    def test_PWD_N_007_common_password(self):
        """PWD-N-007: Reject common/breached password."""
        token, _ = self.register_and_token()
        resp = self.change_password(
            token,
            self.test_data["passwordChange"]["commonPassword"],
        )
        self.assertEqual(resp.status_code, 422)
