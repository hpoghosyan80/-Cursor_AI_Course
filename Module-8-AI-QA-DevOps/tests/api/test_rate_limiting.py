"""REST API rate limiting tests."""

from tests.api.base import BaseRestApiTestCase


class TestRateLimiting(BaseRestApiTestCase):
    def test_login_rate_limit_exceeded(self):
        """POST /api/auth/login — 10+ failed attempts/min returns 429."""
        user = self.test_data["users"]["customer"]
        last_status = None
        for _ in range(11):
            resp = self.client.post(
                "/api/auth/login",
                json={"email": user["email"], "password": "WrongPass1"},
            )
            last_status = resp.status_code
        self.assertEqual(last_status, 429)
        self.assertEqual(resp.get_json()["code"], "TOO_MANY_REQUESTS")

    def test_global_rate_limit_exceeded(self):
        """Global rate limit — 100+ requests/min returns 429."""
        last_status = 200
        for i in range(101):
            resp = self.client.get("/api/products")
            last_status = resp.status_code
            if last_status == 429:
                break
        self.assertEqual(last_status, 429)
