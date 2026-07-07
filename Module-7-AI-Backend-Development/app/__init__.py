"""Flask application factory."""

import os

from flask import Flask, jsonify
from flask_cors import CORS

from app.config import Config
from app.extensions import api, db, jwt, limiter, ma, migrate
from app.models.token_blocklist import TokenBlocklist
from app.utils.errors import register_error_handlers


def create_app(config_class: type[Config] = Config) -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    api.init_app(app)

    register_error_handlers(app)
    _register_jwt_handlers(jwt)
    _register_blueprints()
    _register_routes(app)

    return app


def _register_jwt_handlers(jwt_manager) -> None:
    @jwt_manager.token_in_blocklist_loader
    def check_if_token_revoked(_jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return (
            db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None
        )

    @jwt_manager.unauthorized_loader
    def unauthorized_callback(reason: str):
        return jsonify(status="error", message=reason, code="UNAUTHORIZED"), 401

    @jwt_manager.invalid_token_loader
    def invalid_token_callback(reason: str):
        return jsonify(status="error", message=reason, code="UNAUTHORIZED"), 422

    @jwt_manager.expired_token_loader
    def expired_token_callback(_jwt_header, _jwt_payload):
        return jsonify(status="error", message="Token has expired", code="UNAUTHORIZED"), 401


def _register_blueprints() -> None:
    from app.resources.agents.routes import blp as agents_blp
    from app.resources.auth.routes import blp as auth_blp
    from app.resources.tickets.routes import blp as tickets_blp

    api.register_blueprint(auth_blp)
    api.register_blueprint(tickets_blp)
    api.register_blueprint(agents_blp)


def _register_routes(app: Flask) -> None:
    @app.route("/health")
    def health():
        return jsonify(status="ok"), 200
