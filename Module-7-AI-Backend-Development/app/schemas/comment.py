"""Comment schemas (FR-015)."""

from marshmallow import fields, validate

from app.extensions import ma
from app.models.comment import Comment
from app.schemas.user import UserSchema


class CommentSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested(UserSchema, exclude=("expertise_areas",))

    class Meta:
        model = Comment
        load_instance = True
        include_fk = True


class CommentCreateSchema(ma.Schema):
    content = fields.Str(required=True, validate=validate.Length(min=1, max=5000))
    is_internal = fields.Bool(load_default=False)
