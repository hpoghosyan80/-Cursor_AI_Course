"""API error types for the profile management test application."""


class APIError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


class ValidationError(APIError):
    def __init__(self, message: str, field: str | None = None):
        super().__init__(message, 422, "VALIDATION_ERROR")
        self.field = field
