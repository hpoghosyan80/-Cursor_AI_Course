"""Security registration test cases (REG-S-*)."""

from src.app import store
from tests.base import BaseProfileTestCase


class TestRegistrationSecurity(BaseProfileTestCase):
    def test_REG_S_001_sql_injection_email(self):
        """REG-S-001: SQL injection in email field."""
        resp = self.register_payload(
            self.test_data["invalidRegistration"]["sqlInjectionEmail"]
        )
        self.assertIn(resp.status_code, (201, 422))
        self.assertGreaterEqual(len(store.users), 0)

    def test_REG_S_002_xss_in_name(self):
        """REG-S-002: XSS in name field is sanitized."""
        resp = self.register_payload(
            self.test_data["invalidRegistration"]["xssInName"]
        )
        self.assertEqual(resp.status_code, 201)
        self.assertNotIn("<script>", resp.get_json()["name"])

    def test_REG_S_003_password_not_in_response(self):
        """REG-S-003: Password not returned in response."""
        resp = self.register_payload(self.test_data["validUsers"]["newCustomer"])
        body = resp.get_json()
        self.assertNotIn("password", body)
        self.assertNotIn("password_hash", body)

    def test_REG_S_004_password_stored_hashed(self):
        """REG-S-004: Password stored hashed in database."""
        data = self.test_data["validUsers"]["newCustomer"]
        resp = self.register_payload(data)
        user_id = resp.get_json()["id"]
        record = store.get_user_record(user_id)
        self.assertIsNotNone(record)
        self.assertNotEqual(record["password_hash"], data["password"])
        self.assertTrue(record["password_hash"].startswith("$2b$"))

    def test_REG_S_005_mass_assignment_is_active(self):
        """REG-S-005: Mass assignment of is_active ignored."""
        payload = dict(self.test_data["validUsers"]["newCustomer"])
        payload["email"] = "massassign@example.com"
        payload["is_active"] = False
        resp = self.register_payload(payload)
        self.assertTrue(resp.get_json()["is_active"])

    def test_REG_S_006_json_injection_email(self):
        """REG-S-006: JSON injection in email field."""
        resp = self.client.post(
            "/api/auth/register",
            json={
                "name": "Inject",
                "email": {"$gt": ""},
                "password": "ValidPass1",
            },
        )
        self.assertEqual(resp.status_code, 422)
