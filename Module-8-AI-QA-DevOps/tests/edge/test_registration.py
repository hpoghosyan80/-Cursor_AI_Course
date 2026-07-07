"""Edge-case registration test cases (REG-E-*)."""

from tests.base import BaseProfileTestCase


class TestRegistrationEdge(BaseProfileTestCase):
    def test_REG_E_001_whitespace_trimmed_name(self):
        """REG-E-001: Whitespace-trimmed name on registration."""
        data = self.test_data["edgeCases"]["whitespacePaddedName"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], "Padded Name")

    def test_REG_E_006_rate_limit_registration(self):
        """REG-E-006: Rate limit on registration (20/min)."""
        for i in range(20):
            resp = self.register_payload(
                {
                    "name": f"User {i}",
                    "email": f"rate{i}@example.com",
                    "password": "ValidPass1",
                }
            )
            self.assertEqual(resp.status_code, 201, f"Request {i} failed")
        resp = self.register_payload(
            {
                "name": "Rate Limited",
                "email": "ratelimit@example.com",
                "password": "ValidPass1",
            }
        )
        self.assertEqual(resp.status_code, 429)
