"""Authentication routes."""

from flask.views import MethodView
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from flask_smorest import Blueprint

from app.extensions import db, limiter
from app.models.enums import UserRole
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.schemas.user import LoginSchema, RegisterSchema, TokenSchema, UserSchema
from app.utils.errors import APIError
from app.utils.permissions import get_current_user

blp = Blueprint("auth", __name__, url_prefix="/api/auth", description="Authentication")


@blp.route("/register")
class Register(MethodView):
    @limiter.limit("20 per minute")
    @blp.arguments(RegisterSchema)
    @blp.response(201, UserSchema)
    def post(self, data):
        """Register a new user account."""
        if User.query.filter_by(email=data["email"]).first():
            raise APIError("Email already registered", 409, "CONFLICT")

        role = data.get("role", UserRole.CUSTOMER)
        if role != UserRole.CUSTOMER:
            raise APIError(
                "Only customer self-registration is allowed",
                403,
                "FORBIDDEN",
            )

        user = User(
            name=data["name"],
            email=data["email"].lower(),
            role=UserRole.CUSTOMER,
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return user


@blp.route("/login")
class Login(MethodView):
    @limiter.limit("30 per minute")
    @blp.arguments(LoginSchema)
    @blp.response(200, TokenSchema)
    def post(self, credentials):
        """Login and receive a JWT access token."""
        user = User.query.filter_by(email=credentials["email"].lower()).first()
        if user is None or not user.check_password(credentials["password"]):
            raise APIError("Invalid email or password", 401, "UNAUTHORIZED")
        if not user.is_active:
            raise APIError("Account is disabled", 403, "FORBIDDEN")
        return {
            "access_token": create_access_token(identity=str(user.id)),
            "token_type": "Bearer",
        }


@blp.route("/logout")
class Logout(MethodView):
    @jwt_required()
    def post(self):
        """Revoke the current JWT token."""
        db.session.add(TokenBlocklist(jti=get_jwt()["jti"]))
        db.session.commit()
        return {"message": "Successfully logged out"}


@blp.route("/me")
class CurrentUser(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self):
        """Get the authenticated user profile."""
        return get_current_user()
