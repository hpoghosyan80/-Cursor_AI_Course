"""Shared fixtures for REST API test suite."""

from __future__ import annotations

import json
import time
import unittest
from pathlib import Path

from src.rest_app import create_rest_app, rest_store

MODULE_ROOT = Path(__file__).resolve().parent.parent.parent
TEST_DATA_PATH = MODULE_ROOT / "test-data" / "rest-api-test-data.json"
MAX_RESPONSE_MS = 500


def load_rest_test_data() -> dict:
    return json.loads(TEST_DATA_PATH.read_text(encoding="utf-8"))


class BaseRestApiTestCase(unittest.TestCase):
    """Base REST API tests with setup/teardown and auth helpers."""

    test_data: dict

    @classmethod
    def setUpClass(cls) -> None:
        cls.test_data = load_rest_test_data()
        cls.app = create_rest_app()
        cls.app_context = cls.app.app_context()
        cls.app_context.push()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.app_context.pop()

    def setUp(self) -> None:
        rest_store.reset()
        self.client = self.app.test_client()

    def tearDown(self) -> None:
        rest_store.reset()

    def login(self, email: str, password: str):
        return self.client.post("/api/auth/login", json={"email": email, "password": password})

    def auth_headers(self, role: str = "customer") -> dict[str, str]:
        user = self.test_data["users"][role]
        resp = self.login(user["email"], user["password"])
        self.assertEqual(resp.status_code, 200, resp.get_json())
        token = resp.get_json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def admin_headers(self) -> dict[str, str]:
        return self.auth_headers("admin")

    def customer_headers(self) -> dict[str, str]:
        return self.auth_headers("customer")

    def assert_response_time_under(self, response, max_ms: int = MAX_RESPONSE_MS) -> float:
        elapsed_ms = response.elapsed.total_seconds() * 1000
        self.assertLess(
            elapsed_ms,
            max_ms,
            f"Response took {elapsed_ms:.1f}ms, expected < {max_ms}ms",
        )
        return elapsed_ms

    def timed_get(self, path: str, **kwargs):
        start = time.perf_counter()
        response = self.client.get(path, **kwargs)
        elapsed_ms = (time.perf_counter() - start) * 1000
        return response, elapsed_ms

    def first_product_id(self) -> str:
        resp = self.client.get("/api/products")
        return resp.get_json()["items"][0]["id"]
