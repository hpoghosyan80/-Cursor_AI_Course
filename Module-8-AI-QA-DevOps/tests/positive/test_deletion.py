"""Positive account deletion test cases (DEL-P-*)."""

from tests.base import BaseProfileTestCase


class TestDeletionPositive(BaseProfileTestCase):
    def test_DEL_P_001_soft_delete_valid_confirmation(self):
        """DEL-P-001: Soft delete with valid confirmation."""
        token, data = self.register_and_token()
        payload = self.test_data["accountDeletion"]["valid"]
        resp = self.delete_account(token, payload)
        self.assertEqual(resp.status_code, 200)
        login = self.login(data["email"], data["password"])
        self.assertEqual(login.status_code, 403)

    def test_DEL_P_002_profile_inaccessible_after_deletion(self):
        """DEL-P-002: Profile inaccessible after deletion."""
        token, _ = self.register_and_token()
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        resp = self.get_profile(token)
        self.assertIn(resp.status_code, (401, 403))

    def test_DEL_P_003_reactivate_within_grace_period(self):
        """DEL-P-003: Reactivate within grace period."""
        token, data = self.register_and_token()
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        resp = self.client.post(
            "/api/users/me/reactivate",
            json={"email": data["email"], "password": data["password"]},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.get_json()["is_active"])
        login = self.login(data["email"], data["password"])
        self.assertEqual(login.status_code, 200)

    def test_DEL_P_004_data_retained_during_grace(self):
        """DEL-P-004: Data retained during grace period."""
        token, data = self.register_and_token()
        user_id = self.get_profile(token).get_json()["id"]
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        from src.app import store

        user = store.get_user_record(user_id)
        self.assertIsNotNone(user)
        self.assertFalse(user["is_active"])
        self.assertIsNotNone(user["deleted_at"])
