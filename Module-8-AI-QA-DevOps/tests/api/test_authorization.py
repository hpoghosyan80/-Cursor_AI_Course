"""REST API authorization (role-based access) tests."""

from tests.api.base import BaseRestApiTestCase


class TestAuthorization(BaseRestApiTestCase):
    def test_customer_cannot_list_users(self):
        """GET /api/users — customer forbidden."""
        resp = self.client.get("/api/users", headers=self.customer_headers())
        self.assertEqual(resp.status_code, 403)

    def test_customer_cannot_create_product(self):
        """POST /api/products — customer forbidden."""
        resp = self.client.post(
            "/api/products",
            headers=self.customer_headers(),
            json=self.test_data["products"]["valid"],
        )
        self.assertEqual(resp.status_code, 403)

    def test_customer_cannot_update_order_status(self):
        """PUT /api/orders/:id — customer cannot update status."""
        product_id = self.first_product_id()
        order = self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json={"items": [{"product_id": product_id, "quantity": 1}]},
        ).get_json()
        resp = self.client.put(
            f"/api/orders/{order['id']}",
            headers=self.customer_headers(),
            json={"status": "paid"},
        )
        self.assertEqual(resp.status_code, 403)

    def test_customer_cannot_read_other_users_order(self):
        """GET /api/orders/:id — IDOR blocked."""
        product_id = self.first_product_id()
        order = self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json={"items": [{"product_id": product_id, "quantity": 1}]},
        ).get_json()
        other = self.test_data["users"]["customerTwo"]
        token = self.login(other["email"], other["password"]).get_json()["access_token"]
        resp = self.client.get(
            f"/api/orders/{order['id']}",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(resp.status_code, 403)

    def test_admin_can_list_all_orders(self):
        """GET /api/orders — admin sees all orders."""
        resp = self.client.get("/api/orders", headers=self.admin_headers())
        self.assertEqual(resp.status_code, 200)

    def test_customer_cannot_delete_user(self):
        """DELETE /api/users/:id — customer forbidden."""
        users = self.client.get("/api/users", headers=self.admin_headers()).get_json()
        target = users[0]["id"]
        resp = self.client.delete(f"/api/users/{target}", headers=self.customer_headers())
        self.assertEqual(resp.status_code, 403)
