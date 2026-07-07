"""Edge-case profile test cases (UPD-E-*)."""

from tests.base import BaseProfileTestCase


class TestProfileEdge(BaseProfileTestCase):
    def test_UPD_E_001_bio_exactly_500_chars(self):
        """UPD-E-001: Bio at exactly 500 characters."""
        token, _ = self.register_and_token()
        payload = self.test_data["edgeCases"]["maxLengthBio"]
        resp = self.patch_profile(token, payload)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.get_json()["bio"]), 500)

    def test_UPD_E_002_unicode_emoji_in_bio(self):
        """UPD-E-002: Unicode and emoji in bio."""
        token, _ = self.register_and_token()
        bio = "Hello 世界 🌍"
        resp = self.patch_profile(token, {"bio": bio})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["bio"], bio)

    def test_UPD_E_003_idempotent_duplicate_patch(self):
        """UPD-E-003: Idempotent duplicate PATCH."""
        token, _ = self.register_and_token()
        update = self.test_data["profileUpdates"]["validPartial"]
        first = self.patch_profile(token, update)
        second = self.patch_profile(token, update)
        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.get_json()["name"], second.get_json()["name"])
