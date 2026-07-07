"""Negative profile test cases (PROF-N-*, UPD-N-*)."""

from tests.base import BaseProfileTestCase


class TestProfileNegative(BaseProfileTestCase):
    def test_PROF_N_001_unauthenticated_get(self):
        """PROF-N-001: Reject unauthenticated profile request."""
        resp = self.client.get("/api/auth/me")
        self.assertEqual(resp.status_code, 401)

    def test_PROF_N_002_invalid_jwt(self):
        """PROF-N-002: Reject invalid JWT."""
        token = self.test_data["securityPayloads"]["jwtTampered"]
        resp = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(resp.status_code, 401)

    def test_PROF_N_004_revoked_token_after_logout(self):
        """PROF-N-004: Reject revoked token after logout."""
        token, _ = self.register_and_token()
        logout = self.client.post(
            "/api/auth/logout",
            headers=self.bearer_headers(token),
        )
        self.assertEqual(logout.status_code, 200)
        resp = self.get_profile(token)
        self.assertEqual(resp.status_code, 401)

    def test_PROF_N_005_disabled_account(self):
        """PROF-N-005: Reject disabled account token."""
        token, data = self.register_and_token()
        self.delete_account(token, self.test_data["accountDeletion"]["valid"])
        resp = self.get_profile(token)
        self.assertIn(resp.status_code, (401, 403))

    def test_UPD_N_001_unauthenticated_update(self):
        """UPD-N-001: Reject unauthenticated update."""
        resp = self.client.patch(
            "/api/users/me",
            json=self.test_data["profileUpdates"]["validPartial"],
        )
        self.assertEqual(resp.status_code, 401)

    def test_UPD_N_002_duplicate_email(self):
        """UPD-N-002: Reject duplicate email on update."""
        self.register_payload(self.test_data["validUsers"]["existingCustomer"])
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            {"email": self.test_data["validUsers"]["existingCustomer"]["email"]},
        )
        self.assertEqual(resp.status_code, 409)

    def test_UPD_N_003_invalid_email_format(self):
        """UPD-N-003: Reject invalid email format."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(token, {"email": "bad@"})
        self.assertEqual(resp.status_code, 422)

    def test_UPD_N_004_bio_too_long(self):
        """UPD-N-004: Reject bio exceeding 500 characters."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["profileUpdates"]["invalidBioTooLong"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_N_005_invalid_avatar_url(self):
        """UPD-N-005: Reject invalid avatar URL."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["profileUpdates"]["invalidAvatarUrl"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_N_006_http_avatar_url(self):
        """UPD-N-006: Reject HTTP avatar URL."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["profileUpdates"]["httpAvatarUrl"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_N_007_empty_name(self):
        """UPD-N-007: Reject empty name."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["profileUpdates"]["emptyName"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_UPD_N_008_role_escalation(self):
        """UPD-N-008: Reject role self-escalation."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(
            token,
            self.test_data["profileUpdates"]["roleEscalationAttempt"],
        )
        self.assertEqual(resp.status_code, 403)

    def test_UPD_N_010_empty_patch_body(self):
        """UPD-N-010: Reject PATCH with no valid fields."""
        token, _ = self.register_and_token()
        resp = self.patch_profile(token, {})
        self.assertEqual(resp.status_code, 400)
