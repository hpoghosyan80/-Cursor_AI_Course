"""User schemas."""

from marshmallow import fields, validate

from app.extensions import ma
from app.models.enums import AvailabilityStatus, UserRole
from app.models.user import User


class UserSchema(ma.SQLAlchemyAutoSchema):
    role = fields.Enum(UserRole, by_value=True)
    availability_status = fields.Enum(AvailabilityStatus, by_value=True)

    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)


class RegisterSchema(ma.Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    role = fields.Enum(UserRole, load_default=UserRole.CUSTOMER)


class LoginSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class TokenSchema(ma.Schema):
    access_token = fields.Str()
    token_type = fields.Str()
