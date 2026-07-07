"""Authentication tests."""


class TestAuth:
    def test_register(self, client):
        resp = client.post(
            "/api/auth/register",
            json={
                "name": "New Customer",
                "email": "new@test.com",
                "password": "password123",
            },
        )
        assert resp.status_code == 201
        assert resp.get_json()["role"] == "customer"

    def test_register_duplicate(self, client, customer):
        resp = client.post(
            "/api/auth/register",
            json={
                "name": "Other",
                "email": "customer@test.com",
                "password": "password123",
            },
        )
        assert resp.status_code == 409

    def test_login(self, client, customer):
        resp = client.post(
            "/api/auth/login",
            json={"email": "customer@test.com", "password": "password123"},
        )
        assert resp.status_code == 200
        assert "access_token" in resp.get_json()

    def test_me(self, client, customer_headers):
        resp = client.get("/api/auth/me", headers=customer_headers)
        assert resp.status_code == 200
        assert resp.get_json()["email"] == "customer@test.com"

    def test_logout(self, client, customer_headers):
        resp = client.post("/api/auth/logout", headers=customer_headers)
        assert resp.status_code == 200

    def test_unauthorized(self, client):
        resp = client.get("/api/tickets/")
        assert resp.status_code == 401
