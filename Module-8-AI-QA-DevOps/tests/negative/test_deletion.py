"""Negative account deletion test cases (DEL-N-*)."""

from tests.base import BaseProfileTestCase


class TestDeletionNegative(BaseProfileTestCase):
    def test_DEL_N_001_missing_password(self):
        """DEL-N-001: Reject deletion without password."""
        token, _ = self.register_and_token()
        resp = self.delete_account(token, {"confirmation": "DELETE"})
        self.assertEqual(resp.status_code, 422)

    def test_DEL_N_002_wrong_password(self):
        """DEL-N-002: Reject deletion with wrong password."""
        token, _ = self.register_and_token()
        resp = self.delete_account(
            token,
            self.test_data["accountDeletion"]["wrongPassword"],
        )
        self.assertEqual(resp.status_code, 401)

    def test_DEL_N_003_missing_confirmation_text(self):
        """DEL-N-003: Reject deletion without confirmation DELETE."""
        token, _ = self.register_and_token()
        resp = self.delete_account(
            token,
            self.test_data["accountDeletion"]["missingConfirmation"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_DEL_N_004_wrong_confirmation_case(self):
        """DEL-N-004: Reject case-sensitive confirmation mismatch."""
        token, _ = self.register_and_token()
        resp = self.delete_account(
            token,
            self.test_data["accountDeletion"]["wrongConfirmationText"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_DEL_N_005_unauthenticated(self):
        """DEL-N-005: Reject unauthenticated deletion."""
        resp = self.client.delete(
            "/api/users/me",
            json=self.test_data["accountDeletion"]["valid"],
        )
        self.assertEqual(resp.status_code, 401)

    def test_DEL_N_006_double_deletion(self):
        """DEL-N-006: Reject double deletion."""
        token, data = self.register_and_token()
        payload = self.test_data["accountDeletion"]["valid"]
        self.delete_account(token, payload)
        login = self.login(data["email"], data["password"])
        self.assertEqual(login.status_code, 403)
        resp = self.client.delete(
            "/api/users/me",
            headers=self.bearer_headers(token),
            json=payload,
        )
        self.assertIn(resp.status_code, (401, 403))
