"""Ticket schemas."""

from marshmallow import Schema, fields, validates

from app.extensions import ma
from app.models.attachment import Attachment
from app.models.enums import (
    HistoryAction,
    TicketCategory,
    TicketPriority,
    TicketStatus,
)
from app.models.ticket import Ticket
from app.models.ticket_history import TicketHistory
from app.utils.validators import (
    validate_customer_email,
    validate_description,
    validate_subject,
)


class TicketSchema(ma.SQLAlchemyAutoSchema):
    status = fields.Enum(TicketStatus, by_value=True)
    priority = fields.Enum(TicketPriority, by_value=True)
    category = fields.Enum(TicketCategory, by_value=True)

    class Meta:
        model = Ticket
        load_instance = True
        include_fk = True


class TicketCreateSchema(Schema):
    subject = fields.Str(required=True)
    description = fields.Str(required=True)
    priority = fields.Enum(TicketPriority, by_value=True, load_default=TicketPriority.MEDIUM)
    category = fields.Enum(TicketCategory, by_value=True, required=True)
    customer_email = fields.Str(required=True)
    auto_assign = fields.Bool(load_default=False)

    @validates("subject")
    def validate_subject_field(self, value, **kwargs):
        return validate_subject(value)

    @validates("description")
    def validate_description_field(self, value, **kwargs):
        return validate_description(value)

    @validates("customer_email")
    def validate_email_field(self, value, **kwargs):
        return validate_customer_email(value)


class TicketUpdateSchema(Schema):
    subject = fields.Str()
    description = fields.Str()

    @validates("subject")
    def validate_subject_field(self, value, **kwargs):
        return validate_subject(value)

    @validates("description")
    def validate_description_field(self, value, **kwargs):
        return validate_description(value)


class StatusUpdateSchema(ma.Schema):
    status = fields.Enum(TicketStatus, by_value=True, required=True)


class AssignTicketSchema(ma.Schema):
    assigned_to_id = fields.Int(required=True)
    auto_assign = fields.Bool(load_default=False)


class TicketListSchema(ma.Schema):
    items = fields.Nested(TicketSchema, many=True)
    pagination = fields.Dict()


class AttachmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attachment
        load_instance = True
        exclude = ("file_path",)


class TicketHistorySchema(ma.SQLAlchemyAutoSchema):
    action = fields.Enum(HistoryAction, by_value=True)

    class Meta:
        model = TicketHistory
        load_instance = True
        include_fk = True
