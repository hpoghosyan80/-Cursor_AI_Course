"""Flask application exposing the user profile management API under test."""

from __future__ import annotations

from flask import Flask, g, jsonify, request

from src.errors import APIError, ValidationError
from src.store import ProfileStore

store = ProfileStore()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["TESTING"] = True

    @app.errorhandler(APIError)
    def handle_api_error(exc: APIError):
        return jsonify({"message": exc.message, "code": exc.code}), exc.status_code

    @app.errorhandler(ValidationError)
    def handle_validation_error(exc: ValidationError):
        body = {"message": exc.message, "code": exc.code}
        if exc.field:
            body["field"] = exc.field
        return jsonify(body), exc.status_code

    def _bearer_token() -> str | None:
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return None
        return header[7:]

    @app.post("/api/auth/register")
    def register():
        user = store.register(request.get_json(silent=True) or {})
        return jsonify(user), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        result = store.login(data.get("email", ""), data.get("password", ""))
        return jsonify(result), 200

    @app.post("/api/auth/logout")
    def logout():
        token = _bearer_token()
        if not token:
            raise APIError("Missing token", 401, "UNAUTHORIZED")
        return jsonify(store.logout(token)), 200

    @app.get("/api/auth/me")
    def me():
        token = _bearer_token()
        if not token:
            raise APIError("Missing token", 401, "UNAUTHORIZED")
        return jsonify(store.get_profile(token)), 200

    @app.patch("/api/users/me")
    def update_me():
        token = _bearer_token()
        if not token:
            raise APIError("Missing token", 401, "UNAUTHORIZED")
        return jsonify(store.update_profile(token, request.get_json(silent=True) or {})), 200

    @app.put("/api/users/me/password")
    def change_password():
        token = _bearer_token()
        if not token:
            raise APIError("Missing token", 401, "UNAUTHORIZED")
        return jsonify(store.change_password(token, request.get_json(silent=True) or {})), 200

    @app.delete("/api/users/me")
    def delete_me():
        token = _bearer_token()
        if not token:
            raise APIError("Missing token", 401, "UNAUTHORIZED")
        return jsonify(store.delete_account(token, request.get_json(silent=True) or {})), 200

    @app.post("/api/users/me/reactivate")
    def reactivate():
        data = request.get_json(silent=True) or {}
        return jsonify(store.reactivate(data.get("email", ""), data.get("password", ""))), 200

    @app.before_request
    def reset_store_for_tests():
        # Each request in tests uses setUp reset; hook reserved for extensions.
        g.store = store

    return app
