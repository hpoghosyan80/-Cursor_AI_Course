"""REST API error response format tests."""

from tests.api.base import BaseRestApiTestCase


class TestErrorResponses(BaseRestApiTestCase):
    def test_404_product_not_found(self):
        """GET /api/products/:id — unknown product returns 404."""
        resp = self.client.get("/api/products/PROD-999")
        self.assertEqual(resp.status_code, 404)
        body = resp.get_json()
        self.assertIn("message", body)
        self.assertEqual(body["code"], "NOT_FOUND")

    def test_404_user_not_found(self):
        """GET /api/users/:id — unknown user returns 404."""
        resp = self.client.get("/api/users/99999", headers=self.admin_headers())
        self.assertEqual(resp.status_code, 404)

    def test_404_order_not_found(self):
        """GET /api/orders/:id — unknown order returns 404."""
        resp = self.client.get("/api/orders/ORD-FAKE", headers=self.customer_headers())
        self.assertEqual(resp.status_code, 404)

    def test_409_duplicate_email(self):
        """POST /api/users — duplicate email returns 409."""
        payload = {
            "name": "Duplicate",
            "email": "customer@api.test",
            "password": "DupPass1",
            "role": "customer",
        }
        resp = self.client.post("/api/users", headers=self.admin_headers(), json=payload)
        self.assertEqual(resp.status_code, 409)
        self.assertEqual(resp.get_json()["code"], "CONFLICT")

    def test_422_validation_error_has_field(self):
        """422 responses include field name for validation errors."""
        resp = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json={"price": -1},
        )
        self.assertEqual(resp.status_code, 422)
        self.assertIn("field", resp.get_json())

    def test_401_unauthorized_error_code(self):
        """401 responses use UNAUTHORIZED code."""
        resp = self.client.get("/api/orders")
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.get_json()["code"], "UNAUTHORIZED")

    def test_403_forbidden_error_code(self):
        """403 responses use FORBIDDEN code."""
        resp = self.client.get("/api/users", headers=self.customer_headers())
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.get_json()["code"], "FORBIDDEN")

    def test_400_cancel_non_pending_order(self):
        """DELETE /api/orders/:id — non-pending order returns 400."""
        product_id = self.first_product_id()
        order = self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json={"items": [{"product_id": product_id, "quantity": 1}]},
        ).get_json()
        self.client.put(
            f"/api/orders/{order['id']}",
            headers=self.admin_headers(),
            json={"status": "paid"},
        )
        resp = self.client.delete(
            f"/api/orders/{order['id']}",
            headers=self.customer_headers(),
        )
        self.assertEqual(resp.status_code, 400)
