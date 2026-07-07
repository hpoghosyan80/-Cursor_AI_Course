"""Security profile test cases (UPD-S-*)."""

from tests.base import BaseProfileTestCase


class TestProfileSecurity(BaseProfileTestCase):
    def test_UPD_S_001_xss_sanitization_in_bio(self):
        """UPD-S-001: XSS sanitization in bio."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(token, {"bio": "<script>alert(1)</script>"})
        self.assertEqual(resp.status_code, 200)
        self.assertNotIn("<script>", resp.get_json()["bio"])

    def test_UPD_S_002_ssrf_via_avatar_url(self):
        """UPD-S-002: SSRF via avatar URL blocked."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["securityPayloads"]["ssrfInternalUrl"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_S_003_path_traversal_avatar_url(self):
        """UPD-S-003: Path traversal in avatar URL rejected."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["securityPayloads"]["pathTraversalAvatar"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_S_004_mass_assignment_is_active(self):
        """UPD-S-004: Cannot self-reactivate via PATCH is_active."""
        token, _ = self.register_and_token()
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        resp = self.patch_profile(token, {"is_active": True})
        self.assertIn(resp.status_code, (401, 403))
