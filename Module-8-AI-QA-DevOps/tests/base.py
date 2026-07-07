"""Shared unittest fixtures for Module 8 profile management tests."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

from src.app import create_app, store

MODULE_ROOT = Path(__file__).resolve().parent.parent
TEST_DATA_PATH = MODULE_ROOT / "test-data" / "user-profile-test-data.json"


def load_test_data() -> dict:
    return json.loads(TEST_DATA_PATH.read_text(encoding="utf-8"))


class BaseProfileTestCase(unittest.TestCase):
    """Base test case with setup/teardown and HTTP helpers."""

    test_data: dict

    @classmethod
    def setUpClass(cls) -> None:
        cls.test_data = load_test_data()
        cls.app = create_app()
        cls.app_context = cls.app.app_context()
        cls.app_context.push()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.app_context.pop()

    def setUp(self) -> None:
        store.reset()
        self.client = self.app.test_client()

    def tearDown(self) -> None:
        store.reset()

    def register_payload(self, payload: dict):
        fields = (
            "name",
            "email",
            "password",
            "role",
            "bio",
            "avatar_url",
            "notification_email",
            "notification_push",
            "is_active",
            "is_admin",
        )
        body = {k: v for k, v in payload.items() if k in fields}
        return self.client.post("/api/auth/register", json=body)

    def register_fixture(self, key: str = "newCustomer"):
        return self.register_payload(self.test_data["validUsers"][key])

    def login(self, email: str, password: str):
        return self.client.post(
            "/api/auth/login",
            json={"email": email, "password": password},
        )

    def bearer_headers(self, token: str) -> dict[str, str]:
        return {"Authorization": f"Bearer {token}"}

    def register_and_token(self, key: str = "newCustomer") -> tuple[str, dict]:
        payload = self.test_data["validUsers"][key]
        resp = self.register_fixture(key)
        self.assertEqual(resp.status_code, 201, resp.get_json())
        login_resp = self.login(payload["email"], payload["password"])
        self.assertEqual(login_resp.status_code, 200, login_resp.get_json())
        return login_resp.get_json()["access_token"], payload

    def get_profile(self, token: str):
        return self.client.get("/api/auth/me", headers=self.bearer_headers(token))

    def patch_profile(self, token: str, payload: dict):
        return self.client.patch(
            "/api/users/me",
            headers=self.bearer_headers(token),
            json=payload,
        )

    def change_password(self, token: str, payload: dict):
        return self.client.put(
            "/api/users/me/password",
            headers=self.bearer_headers(token),
            json=payload,
        )

    def delete_account(self, token: str, payload: dict):
        return self.client.delete(
            "/api/users/me",
            headers=self.bearer_headers(token),
            json=payload,
        )
