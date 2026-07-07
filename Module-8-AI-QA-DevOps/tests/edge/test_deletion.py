"""Edge-case account deletion test cases (DEL-E-*)."""

from datetime import datetime, timedelta, timezone

from src.app import store
from tests.base import BaseProfileTestCase


class TestDeletionEdge(BaseProfileTestCase):
    def test_DEL_E_002_email_reusable_after_purge(self):
        """DEL-E-002: Email reusable after permanent purge."""
        data = self.test_data["validUsers"]["newCustomer"]
        token, _ = self.register_and_token()
        user_id = self.get_profile(token).get_json()["id"]
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])

        user = store.users[user_id]
        user["purge_at"] = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()

        resp = self.register_payload(
            {
                "name": data["name"],
                "email": data["email"],
                "password": "ReusePass1",
            }
        )
        self.assertEqual(resp.status_code, 201)
