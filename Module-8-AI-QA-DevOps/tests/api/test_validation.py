"""REST API input validation tests."""

from tests.api.base import BaseRestApiTestCase


class TestValidation(BaseRestApiTestCase):
    def test_create_user_missing_email(self):
        """POST /api/users — missing email returns 422."""
        resp = self.client.post(
            "/api/users",
            headers=self.admin_headers(),
            json=self.test_data["invalidUsers"]["missingEmail"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_user_invalid_email(self):
        """POST /api/users — invalid email returns 422."""
        resp = self.client.post(
            "/api/users",
            headers=self.admin_headers(),
            json=self.test_data["invalidUsers"]["invalidEmail"],
        )
        self.assertEqual(resp.status_code, 422)
        self.assertEqual(resp.get_json()["field"], "email")

    def test_create_user_short_name(self):
        """POST /api/users — short name returns 422."""
        resp = self.client.post(
            "/api/users",
            headers=self.admin_headers(),
            json=self.test_data["invalidUsers"]["shortName"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_product_missing_name(self):
        """POST /api/products — missing name returns 422."""
        resp = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json=self.test_data["products"]["invalid"]["missingName"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_product_negative_price(self):
        """POST /api/products — negative price returns 422."""
        resp = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json=self.test_data["products"]["invalid"]["negativePrice"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_product_negative_stock(self):
        """POST /api/products — negative stock returns 422."""
        resp = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json=self.test_data["products"]["invalid"]["negativeStock"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_order_empty_items(self):
        """POST /api/orders — empty items returns 422."""
        resp = self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json=self.test_data["orders"]["emptyItems"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_order_invalid_product(self):
        """POST /api/orders — invalid product_id returns 422."""
        resp = self.client.post(
            "/api/orders",
            headers=self.customer_headers(),
            json=self.test_data["orders"]["invalidProduct"],
        )
        self.assertEqual(resp.status_code, 422)

    def test_create_order_invalid_quantity(self):
        """POST /api/orders — zero quantity returns 422."""
        product_id = self.first_product_id()
        payload = {"items": [{"product_id": product_id, "quantity": 0}]}
        resp = self.client.post("/api/orders", headers=self.customer_headers(), json=payload)
        self.assertEqual(resp.status_code, 422)

    def test_xss_sanitized_in_user_name(self):
        """POST /api/users — XSS in name sanitized."""
        resp = self.client.post(
            "/api/users",
            headers=self.admin_headers(),
            json={
                "name": self.test_data["security"]["xssName"],
                "email": "xss@api.test",
                "password": "ValidPass1",
                "role": "customer",
            },
        )
        self.assertEqual(resp.status_code, 201)
        self.assertNotIn("<script>", resp.get_json()["name"])
