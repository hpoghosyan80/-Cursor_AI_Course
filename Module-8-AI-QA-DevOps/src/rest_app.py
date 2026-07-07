"""Flask REST API application for user, product, and order management."""

from flask import Flask, jsonify, request

from src.errors import APIError, ValidationError
from src.rest_store import RestStore

rest_store = RestStore()


def create_rest_app() -> Flask:
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

    def _token() -> str | None:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            return header[7:]
        return None

    def _actor(required: bool = True):
        token = _token()
        if not token:
            if required:
                raise APIError("Missing token", 401, "UNAUTHORIZED")
            return None
        return rest_store.resolve_token(token)

    @app.before_request
    def rate_limit():
        rest_store.record_request()

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        return jsonify(rest_store.login(data.get("email", ""), data.get("password", "")))

    @app.post("/api/auth/register")
    def register():
        user = rest_store.register(request.get_json(silent=True) or {})
        return jsonify(user), 201

    @app.get("/api/users")
    def list_users():
        return jsonify(rest_store.list_users(_actor()))

    @app.get("/api/users/<int:user_id>")
    def get_user(user_id: int):
        return jsonify(rest_store.get_user(user_id, _actor()))

    @app.post("/api/users")
    def create_user():
        user = rest_store.create_user(request.get_json(silent=True) or {}, _actor())
        return jsonify(user), 201

    @app.put("/api/users/<int:user_id>")
    def update_user(user_id: int):
        return jsonify(rest_store.update_user(user_id, request.get_json(silent=True) or {}, _actor()))

    @app.delete("/api/users/<int:user_id>")
    def delete_user(user_id: int):
        return jsonify(rest_store.delete_user(user_id, _actor()))

    @app.get("/api/products")
    def list_products():
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)
        return jsonify(rest_store.list_products(page, per_page))

    @app.get("/api/products/<product_id>")
    def get_product(product_id: str):
        return jsonify(rest_store.get_product(product_id))

    @app.post("/api/products")
    def create_product():
        product = rest_store.create_product(request.get_json(silent=True) or {}, _actor())
        return jsonify(product), 201

    @app.put("/api/products/<product_id>")
    def update_product(product_id: str):
        return jsonify(rest_store.update_product(product_id, request.get_json(silent=True) or {}, _actor()))

    @app.delete("/api/products/<product_id>")
    def delete_product(product_id: str):
        return jsonify(rest_store.delete_product(product_id, _actor()))

    @app.get("/api/orders")
    def list_orders():
        return jsonify(rest_store.list_orders(_actor()))

    @app.get("/api/orders/<order_id>")
    def get_order(order_id: str):
        return jsonify(rest_store.get_order(order_id, _actor()))

    @app.post("/api/orders")
    def create_order():
        order = rest_store.create_order(request.get_json(silent=True) or {}, _actor())
        return jsonify(order), 201

    @app.put("/api/orders/<order_id>")
    def update_order(order_id: str):
        return jsonify(rest_store.update_order(order_id, request.get_json(silent=True) or {}, _actor()))

    @app.delete("/api/orders/<order_id>")
    def delete_order(order_id: str):
        return jsonify(rest_store.delete_order(order_id, _actor()))

    return app
