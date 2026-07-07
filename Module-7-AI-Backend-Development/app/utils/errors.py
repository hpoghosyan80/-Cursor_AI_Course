"""PRD-compliant error handling."""

from flask import Flask, jsonify
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException


class APIError(Exception):
    """Application-level error with PRD response format."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        code: str = "VALIDATION_ERROR",
        errors: dict | None = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.errors = errors


def error_response(
    message: str,
    code: str,
    status_code: int = 400,
    errors: dict | None = None,
):
    body = {"status": "error", "message": message, "code": code}
    if errors:
        body["errors"] = errors
    return jsonify(body), status_code


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(APIError)
    def handle_api_error(error: APIError):
        return error_response(error.message, error.code, error.status_code, error.errors)

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        return error_response(
            "Input validation failed",
            "VALIDATION_ERROR",
            400,
            error.messages,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        code_map = {
            400: "VALIDATION_ERROR",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "VALIDATION_ERROR",
            429: "RATE_LIMIT_EXCEEDED",
            500: "INTERNAL_ERROR",
        }
        message = error.description
        errors = None
        data = getattr(error, "data", None)
        if data:
            if "message" in data:
                message = data["message"]
            errors = data.get("errors") or data.get("messages")

        if isinstance(message, dict):
            return jsonify(message), error.code

        status_code = 400 if error.code == 422 else error.code
        return error_response(
            str(message) if not errors else "Input validation failed",
            code_map.get(error.code, "INTERNAL_ERROR"),
            status_code,
            errors,
        )

    @app.errorhandler(404)
    def handle_not_found(error):
        return error_response("Resource not found", "NOT_FOUND", 404)

    @app.errorhandler(500)
    def handle_internal_error(error):
        return error_response("Internal server error", "INTERNAL_ERROR", 500)

    @app.errorhandler(429)
    def handle_rate_limit(error):
        return error_response(
            "Too many requests. Please try again later.",
            "RATE_LIMIT_EXCEEDED",
            429,
        )
