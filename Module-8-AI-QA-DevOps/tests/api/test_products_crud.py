"""REST API product catalog CRUD tests."""

from tests.api.base import BaseRestApiTestCase


class TestProductsCrud(BaseRestApiTestCase):
    def test_GET_products_list_public(self):
        """GET /api/products — public list without auth."""
        resp = self.client.get("/api/products")
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertIn("items", body)
        self.assertGreaterEqual(body["total"], 2)

    def test_GET_product_by_id_public(self):
        """GET /api/products/:id — public product detail."""
        product_id = self.first_product_id()
        resp = self.client.get(f"/api/products/{product_id}")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["id"], product_id)

    def test_POST_create_product_as_admin(self):
        """POST /api/products — admin creates product."""
        resp = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json=self.test_data["products"]["valid"],
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["name"], "Wireless Mouse")

    def test_PUT_update_product_as_admin(self):
        """PUT /api/products/:id — admin updates product."""
        product_id = self.first_product_id()
        resp = self.client.put(
            f"/api/products/{product_id}",
            headers=self.admin_headers(),
            json={"price": 34.99},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["price"], 34.99)

    def test_DELETE_product_as_admin(self):
        """DELETE /api/products/:id — admin deletes product."""
        created = self.client.post(
            "/api/products",
            headers=self.admin_headers(),
            json=self.test_data["products"]["validTwo"],
        )
        product_id = created.get_json()["id"]
        resp = self.client.delete(f"/api/products/{product_id}", headers=self.admin_headers())
        self.assertEqual(resp.status_code, 200)
        get_resp = self.client.get(f"/api/products/{product_id}")
        self.assertEqual(get_resp.status_code, 404)
