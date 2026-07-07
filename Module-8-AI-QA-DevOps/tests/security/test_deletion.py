"""Security account deletion test cases (DEL-S-*)."""

from tests.base import BaseProfileTestCase


class TestDeletionSecurity(BaseProfileTestCase):
    def test_DEL_S_004_pii_retained_not_exposed_in_api(self):
        """DEL-S-004: Deleted user record retained internally, not exposed via API."""
        token, data = self.register_and_token()
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        resp = self.get_profile(token)
        self.assertIn(resp.status_code, (401, 403))
        login = self.login(data["email"], data["password"])
        self.assertEqual(login.status_code, 403)
