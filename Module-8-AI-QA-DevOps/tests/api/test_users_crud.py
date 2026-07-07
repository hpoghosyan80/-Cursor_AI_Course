"""REST API user management CRUD tests (GET, POST, PUT, DELETE)."""

from tests.api.base import BaseRestApiTestCase


class TestUsersCrud(BaseRestApiTestCase):
    def test_GET_users_list_as_admin(self):
        """GET /api/users — admin lists all users."""
        resp = self.client.get("/api/users", headers=self.admin_headers())
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.get_json()), 3)

    def test_GET_user_by_id_self(self):
        """GET /api/users/:id — customer reads own profile."""
        headers = self.customer_headers()
        users = self.client.get("/api/users", headers=self.admin_headers()).get_json()
        customer = next(u for u in users if u["email"] == "customer@api.test")
        resp = self.client.get(f"/api/users/{customer['id']}", headers=headers)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["email"], "customer@api.test")

    def test_POST_create_user_as_admin(self):
        """POST /api/users — admin creates user."""
        payload = {
            "name": "New Staff",
            "email": "staff@api.test",
            "password": "StaffPass1",
            "role": "customer",
        }
        resp = self.client.post("/api/users", headers=self.admin_headers(), json=payload)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()["email"], "staff@api.test")

    def test_PUT_update_user(self):
        """PUT /api/users/:id — customer updates own name."""
        headers = self.customer_headers()
        users = self.client.get("/api/users", headers=self.admin_headers()).get_json()
        customer = next(u for u in users if u["email"] == "customer@api.test")
        resp = self.client.put(
            f"/api/users/{customer['id']}",
            headers=headers,
            json={"name": "Updated Customer"},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["name"], "Updated Customer")

    def test_DELETE_user_as_admin(self):
        """DELETE /api/users/:id — admin deletes user."""
        create = self.client.post(
            "/api/users",
            headers=self.admin_headers(),
            json={
                "name": "Temp User",
                "email": "temp@api.test",
                "password": "TempPass1",
                "role": "customer",
            },
        )
        user_id = create.get_json()["id"]
        resp = self.client.delete(f"/api/users/{user_id}", headers=self.admin_headers())
        self.assertEqual(resp.status_code, 200)
        get_resp = self.client.get(f"/api/users/{user_id}", headers=self.admin_headers())
        self.assertEqual(get_resp.status_code, 404)
