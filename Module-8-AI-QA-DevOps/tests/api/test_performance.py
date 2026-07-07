"""REST API performance tests — response time under 500ms."""

import time

from tests.api.base import BaseRestApiTestCase, MAX_RESPONSE_MS


class TestPerformance(BaseRestApiTestCase):
    def test_GET_products_under_500ms(self):
        """GET /api/products responds within 500ms."""
        resp, elapsed = self.timed_get("/api/products")
        self.assertEqual(resp.status_code, 200)
        self.assertLess(elapsed, MAX_RESPONSE_MS)

    def test_GET_product_by_id_under_500ms(self):
        """GET /api/products/:id responds within 500ms."""
        product_id = self.first_product_id()
        resp, elapsed = self.timed_get(f"/api/products/{product_id}")
        self.assertEqual(resp.status_code, 200)
        self.assertLess(elapsed, MAX_RESPONSE_MS)

    def test_GET_users_under_500ms(self):
        """GET /api/users responds within 500ms."""
        headers = self.admin_headers()
        start = time.perf_counter()
        resp = self.client.get("/api/users", headers=headers)
        elapsed = (time.perf_counter() - start) * 1000
        self.assertEqual(resp.status_code, 200)
        self.assertLess(elapsed, MAX_RESPONSE_MS)

    def test_POST_order_under_500ms(self):
        """POST /api/orders responds within 500ms."""
        product_id = self.first_product_id()
        headers = self.customer_headers()
        start = time.perf_counter()
        resp = self.client.post(
            "/api/orders",
            headers=headers,
            json={"items": [{"product_id": product_id, "quantity": 1}]},
        )
        elapsed = (time.perf_counter() - start) * 1000
        self.assertEqual(resp.status_code, 201)
        self.assertLess(elapsed, MAX_RESPONSE_MS)

    def test_GET_orders_under_500ms(self):
        """GET /api/orders responds within 500ms."""
        headers = self.customer_headers()
        start = time.perf_counter()
        resp = self.client.get("/api/orders", headers=headers)
        elapsed = (time.perf_counter() - start) * 1000
        self.assertEqual(resp.status_code, 200)
        self.assertLess(elapsed, MAX_RESPONSE_MS)

    def test_login_under_500ms(self):
        """POST /api/auth/login responds within 500ms."""
        user = self.test_data["users"]["customer"]
        start = time.perf_counter()
        resp = self.client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        elapsed = (time.perf_counter() - start) * 1000
        self.assertEqual(resp.status_code, 200)
        self.assertLess(elapsed, MAX_RESPONSE_MS)
