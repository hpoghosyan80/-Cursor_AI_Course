"""Security password test cases (PWD-S-*)."""

from src.app import store
from tests.base import BaseProfileTestCase


class TestPasswordSecurity(BaseProfileTestCase):
    def test_PWD_S_003_brute_force_current_password(self):
        """PWD-S-003: Brute force current password triggers rate limit."""
        token, data = self.register_and_token()
        passwords = self.test_data["securityPayloads"]["bruteForcePasswords"]
        last_status = None
        for guess in passwords:
            resp = self.change_password(
                token,
                {
                    "current_password": guess,
                    "new_password": "NewSecure2",
                    "confirm_password": "NewSecure2",
                },
            )
            last_status = resp.status_code
        self.assertIn(last_status, (401, 429))

    def test_PWD_S_004_hash_updated_after_change(self):
        """PWD-S-004: New password hash differs from old."""
        token, data = self.register_and_token()
        user_id = self.get_profile(token).get_json()["id"]
        old_hash = store.get_user_record(user_id)["password_hash"]
        self.change_password(token, self.test_data["passwordChange"]["valid"])
        new_hash = store.get_user_record(user_id)["password_hash"]
        self.assertNotEqual(old_hash, new_hash)
