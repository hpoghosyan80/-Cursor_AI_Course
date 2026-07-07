"""Application configuration."""

import os
from datetime import timedelta

_INSTANCE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "instance")
)
_UPLOAD_DIR = os.path.abspath(os.path.join(_INSTANCE_DIR, "uploads"))
_DEFAULT_DB_URI = f"sqlite:///{os.path.join(_INSTANCE_DIR, 'app.db')}"


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", _DEFAULT_DB_URI)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    JWT_SECRET_KEY = os.environ.get(
        "JWT_SECRET_KEY", "jwt-secret-key-change-in-production"
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    BCRYPT_ROUNDS = 12

    UPLOAD_FOLDER = _UPLOAD_DIR
    MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
    MAX_ATTACHMENTS_PER_TICKET = 3
    ALLOWED_ATTACHMENT_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}

    API_TITLE = "Customer Support Ticket System API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/api/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    REOPEN_WINDOW_DAYS = 7
    DEFAULT_PAGE_SIZE = 20


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    RATELIMIT_ENABLED = False
