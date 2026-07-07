"""REST API orders CRUD tests."""

from tests.api.base import BaseRestApiTestCase


class TestOrdersCrud(BaseRestApiTestCase):
    def _create_order(self):
        product_id = self.first_product_id()
        return self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json={"items": [{"product_id": product_id, "quantity": 1}]},
        )

    def test_POST_create_order(self):
        """POST /api/orders — customer creates order."""
        resp = self._create_order()
        self.assertEqual(resp.status_code, 201)
        body = resp.get_json()
        self.assertEqual(body["status"], "pending")
        self.assertGreater(body["total"], 0)

    def test_GET_orders_list_own(self):
        """GET /api/orders — customer sees own orders only."""
        self._create_order()
        resp = self.client.get("/api/orders", headers=self.customer_headers())
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.get_json()), 1)

    def test_GET_order_by_id(self):
        """GET /api/orders/:id — customer reads own order."""
        created = self._create_order().get_json()
        resp = self.client.get(
            f"/api/orders/{created['id']}",
            headers=self.customer_headers(),
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["id"], created["id"])

    def test_PUT_update_order_status_admin(self):
        """PUT /api/orders/:id — admin updates status."""
        created = self._create_order().get_json()
        resp = self.client.put(
            f"/api/orders/{created['id']}",
            headers=self.admin_headers(),
            json={"status": "paid"},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["status"], "paid")

    def test_DELETE_cancel_pending_order(self):
        """DELETE /api/orders/:id — customer cancels pending order."""
        created = self._create_order().get_json()
        resp = self.client.delete(
            f"/api/orders/{created['id']}",
            headers=self.customer_headers(),
        )
        self.assertEqual(resp.status_code, 200)
