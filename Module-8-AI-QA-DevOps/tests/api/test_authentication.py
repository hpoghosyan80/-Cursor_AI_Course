"""REST API authentication tests."""

from tests.api.base import BaseRestApiTestCase


class TestAuthentication(BaseRestApiTestCase):
    def test_login_valid_credentials(self):
        """POST /api/auth/login — valid credentials return token."""
        user = self.test_data["users"]["customer"]
        resp = self.login(user["email"], user["password"])
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertIn("access_token", body)
        self.assertEqual(body["token_type"], "Bearer")

    def test_login_invalid_password(self):
        """POST /api/auth/login — wrong password returns 401."""
        resp = self.client.post("/api/auth/login", json=self.test_data["auth"]["wrongPassword"])
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.get_json()["code"], "UNAUTHORIZED")

    def test_login_nonexistent_user(self):
        """POST /api/auth/login — unknown user returns 401."""
        resp = self.client.post("/api/auth/login", json=self.test_data["auth"]["nonExistentUser"])
        self.assertEqual(resp.status_code, 401)

    def test_protected_endpoint_requires_token(self):
        """GET /api/orders — missing token returns 401."""
        resp = self.client.get("/api/orders")
        self.assertEqual(resp.status_code, 401)

    def test_invalid_token_rejected(self):
        """Bearer invalid token returns 401."""
        resp = self.client.get(
            "/api/orders",
            headers={"Authorization": "Bearer invalid-token"},
        )
        self.assertEqual(resp.status_code, 401)

    def test_register_new_customer(self):
        """POST /api/auth/register — customer self-registration."""
        resp = self.client.post(
            "/api/auth/register",
            json={
                "name": "New Buyer",
                "email": "buyer@api.test",
                "password": "BuyerPass1",
            },
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["role"], "customer")
