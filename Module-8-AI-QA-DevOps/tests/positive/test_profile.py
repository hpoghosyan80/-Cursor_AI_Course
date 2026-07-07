"""Positive profile retrieval and update test cases (PROF-P-*, UPD-P-*)."""

from tests.base import BaseProfileTestCase


class TestProfilePositive(BaseProfileTestCase):
    def test_PROF_P_001_get_own_profile(self):
        """PROF-P-001: Get own profile when authenticated."""
        token, data = self.register_and_token()
        resp = self.get_profile(token)
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertEqual(body["email"], data["email"].lower())
        self.assertNotIn("password_hash", body)

    def test_PROF_P_002_profile_includes_timestamps(self):
        """PROF-P-002: Profile includes timestamps."""
        token, _ = self.register_and_token()
        body = self.get_profile(token).get_json()
        self.assertIn("created_at", body)
        self.assertIn("updated_at", body)

    def test_PROF_P_003_profile_reflects_update(self):
        """PROF-P-003: Profile reflects recent update."""
        token, _ = self.register_and_token()
        update = self.test_data["profileUpdates"]["validPartial"]
        self.patch_profile(token, update)
        body = self.get_profile(token).get_json()
        self.assertEqual(body["name"], update["name"])
        self.assertEqual(body["bio"], update["bio"])

    def test_UPD_P_001_update_name_and_bio(self):
        """UPD-P-001: Update name and bio."""
        token, _ = self.register_and_token()
        update = self.test_data["profileUpdates"]["validPartial"]
        resp = self.patch_profile(token, update)
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertEqual(body["name"], update["name"])
        self.assertEqual(body["bio"], update["bio"])

    def test_UPD_P_002_update_email(self):
        """UPD-P-002: Update email to new unique address."""
        token, _ = self.register_and_token()
        update = self.test_data["profileUpdates"]["validEmailChange"]
        resp = self.patch_profile(token, update)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["email"], update["email"].lower())

    def test_UPD_P_003_update_notification_preferences(self):
        """UPD-P-003: Update notification preferences."""
        token, _ = self.register_and_token()
        update = self.test_data["profileUpdates"]["validPreferences"]
        resp = self.patch_profile(token, update)
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertFalse(body["notification_email"])
        self.assertTrue(body["notification_push"])

    def test_UPD_P_004_update_avatar_https(self):
        """UPD-P-004: Update avatar URL (HTTPS)."""
        token, _ = self.register_and_token()
        payload = {"avatar_url": "https://cdn.example.com/new.png"}
        resp = self.patch_profile(token, payload)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["avatar_url"], payload["avatar_url"])

    def test_UPD_P_005_partial_update_unchanged_fields(self):
        """UPD-P-005: Partial update leaves other fields unchanged."""
        token, data = self.register_and_token()
        self.patch_profile(token, {"bio": "Original bio"})
        resp = self.patch_profile(token, {"name": "New Name Only"})
        body = resp.get_json()
        self.assertEqual(body["name"], "New Name Only")
        self.assertEqual(body["bio"], "Original bio")
        self.assertEqual(body["email"], data["email"].lower())

    def test_UPD_P_006_clear_bio(self):
        """UPD-P-006: Clear bio with empty string."""
        token, _ = self.register_and_token()
        self.patch_profile(token, {"bio": "Temporary bio"})
        resp = self.patch_profile(token, {"bio": ""})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["bio"], "")

    def test_UPD_P_007_clear_avatar_url(self):
        """UPD-P-007: Clear avatar URL."""
        token, _ = self.register_and_token()
        self.patch_profile(token, {"avatar_url": "https://cdn.example.com/a.png"})
        resp = self.patch_profile(token, {"avatar_url": ""})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["avatar_url"], "")
