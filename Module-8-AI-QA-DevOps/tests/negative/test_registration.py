"""Negative registration test cases (REG-N-*)."""

from tests.base import BaseProfileTestCase


class TestRegistrationNegative(BaseProfileTestCase):
    def test_REG_N_001_duplicate_email(self):
        """REG-N-001: Reject duplicate email."""
        data = self.test_data["validUsers"]["newCustomer"]
        self.register_payload(data)
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 409)
        self.assertIn("already registered", resp.get_json()["message"].lower())

    def test_REG_N_002_missing_name(self):
        """REG-N-002: Reject missing name."""
        resp = self.register_payload(self.test_data["invalidRegistration"]["missingName"])
        self.assertEqual(resp.status_code, 422)
        self.assertEqual(resp.get_json()["field"], "name")

    def test_REG_N_003_short_name(self):
        """REG-N-003: Reject name below minimum length."""
        resp = self.register_payload(self.test_data["invalidRegistration"]["shortName"])
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_004_long_name(self):
        """REG-N-004: Reject name above maximum length."""
        payload = dict(self.test_data["invalidRegistration"]["longName"])
        payload["name"] = "A" * 121
        resp = self.register_payload(payload)
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_005_invalid_email(self):
        """REG-N-005: Reject invalid email format."""
        resp = self.register_payload(self.test_data["invalidRegistration"]["invalidEmail"])
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_006_short_password(self):
        """REG-N-006: Reject password below minimum length."""
        resp = self.register_payload(self.test_data["invalidRegistration"]["shortPassword"])
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_007_password_no_uppercase(self):
        """REG-N-007: Reject password without uppercase."""
        resp = self.register_payload(
            self.test_data["invalidRegistration"]["weakPasswordNoUpper"]
        )
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_008_password_no_lowercase(self):
        """REG-N-008: Reject password without lowercase."""
        resp = self.register_payload(
            self.test_data["invalidRegistration"]["weakPasswordNoLower"]
        )
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_009_password_no_digit(self):
        """REG-N-009: Reject password without digit."""
        resp = self.register_payload(
            self.test_data["invalidRegistration"]["weakPasswordNoDigit"]
        )
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_010_empty_body(self):
        """REG-N-010: Reject empty request body."""
        resp = self.client.post("/api/auth/register", json={})
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_011_null_values(self):
        """REG-N-011: Reject null values."""
        resp = self.client.post(
            "/api/auth/register",
            json={"name": None, "email": None, "password": None},
        )
        self.assertEqual(resp.status_code, 422)

    def test_REG_N_012_role_escalation_admin(self):
        """REG-N-012: Reject role escalation to admin."""
        resp = self.register_payload(self.test_data["invalidRegistration"]["roleEscalation"])
        self.assertEqual(resp.status_code, 403)

    def test_REG_N_013_role_escalation_agent(self):
        """REG-N-013: Reject role escalation to agent."""
        resp = self.register_payload(
            {
                "name": "Agent Wannabe",
                "email": "fake@agent.com",
                "password": "ValidPass1",
                "role": "agent",
            }
        )
        self.assertEqual(resp.status_code, 403)

    def test_REG_N_014_mass_assignment_is_active(self):
        """REG-N-014: Reject self-deactivation via is_active on register."""
        payload = dict(self.test_data["validUsers"]["newCustomer"])
        payload["email"] = "inactive@example.com"
        payload["is_active"] = False
        resp = self.register_payload(payload)
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(resp.get_json()["is_active"])
