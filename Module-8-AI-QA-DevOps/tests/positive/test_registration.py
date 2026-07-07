"""Positive registration test cases (REG-P-*)."""

from tests.base import BaseProfileTestCase


class TestRegistrationPositive(BaseProfileTestCase):
    def test_REG_P_001_register_valid_customer(self):
        """REG-P-001: Register with valid customer data."""
        data = self.test_data["validUsers"]["newCustomer"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        body = resp.get_json()
        self.assertIn("id", body)
        self.assertEqual(body["name"], data["name"])
        self.assertEqual(body["email"], data["email"].lower())
        self.assertEqual(body["role"], "customer")
        self.assertTrue(body["is_active"])
        self.assertNotIn("password_hash", body)

    def test_REG_P_002_register_minimum_name_length(self):
        """REG-P-002: Register with 2-character name."""
        resp = self.register_payload(
            {"name": "Jo", "email": "jo@example.com", "password": "ValidPass1"}
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], "Jo")

    def test_REG_P_003_register_maximum_name_length(self):
        """REG-P-003: Register with 120-character name."""
        name = "A" * 120
        resp = self.register_payload(
            {"name": name, "email": "maxname@example.com", "password": "ValidPass1"}
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], name)

    def test_REG_P_004_register_email_plus_addressing(self):
        """REG-P-004: Register with plus-addressing in email."""
        data = self.test_data["edgeCases"]["emailWithPlus"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["email"], data["email"].lower())

    def test_REG_P_005_register_unicode_name(self):
        """REG-P-005: Register with Unicode name."""
        data = self.test_data["edgeCases"]["unicodeName"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], data["name"])

    def test_REG_P_006_register_emoji_name(self):
        """REG-P-006: Register with emoji in name."""
        data = self.test_data["edgeCases"]["emojiName"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], data["name"])

    def test_REG_P_007_email_normalized_lowercase(self):
        """REG-P-007: Email normalized to lowercase."""
        data = self.test_data["edgeCases"]["emailCaseVariation"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["email"], "case.test@example.com")

    def test_REG_P_008_boundary_password_length(self):
        """REG-P-008: Register with 8-character boundary password."""
        data = self.test_data["edgeCases"]["boundaryPassword8Chars"]
        resp = self.register_payload(data)
        self.assertEqual(resp.status_code, 201)
        login = self.login(data["email"], data["password"])
        self.assertEqual(login.status_code, 200)

    def test_REG_P_009_login_after_registration(self):
        """REG-P-009: Login immediately after registration."""
        data = self.test_data["validUsers"]["newCustomer"]
        self.register_payload(data)
        resp = self.login(data["email"], data["password"])
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertIn("access_token", body)
        self.assertEqual(body["token_type"], "Bearer")

    def test_REG_P_010_default_notification_preferences(self):
        """REG-P-010: Default notification preferences on register."""
        token, _ = self.register_and_token()
        resp = self.get_profile(token)
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertTrue(body["notification_email"])
        self.assertFalse(body["notification_push"])
