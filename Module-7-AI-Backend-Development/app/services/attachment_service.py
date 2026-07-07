"""File upload validation and storage (FR-001, NFR-011)."""

import os
import uuid

from flask import current_app
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models import Attachment, Ticket
from app.utils.errors import APIError


def _allowed_extension(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    allowed = current_app.config.get("ALLOWED_ATTACHMENT_EXTENSIONS", set())
    return ext in allowed


def validate_file(file: FileStorage) -> None:
    if not file or not file.filename:
        raise APIError("File is required", 400, "VALIDATION_ERROR")

    if not _allowed_extension(file.filename):
        raise APIError(
            "Invalid file type. Allowed: .pdf, .jpg, .png, .doc, .docx",
            400,
            "VALIDATION_ERROR",
            {"file": ["Unsupported file extension"]},
        )

    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    max_size = current_app.config.get("MAX_ATTACHMENT_SIZE", 5 * 1024 * 1024)
    if size > max_size:
        raise APIError(
            "File exceeds maximum size of 5MB",
            400,
            "VALIDATION_ERROR",
            {"file": ["File size must not exceed 5MB"]},
        )


def save_attachment(
    ticket: Ticket,
    file: FileStorage,
    comment_id: int | None = None,
) -> Attachment:
    validate_file(file)

    existing = Attachment.query.filter_by(ticket_id=ticket.id).count()
    max_files = current_app.config.get("MAX_ATTACHMENTS_PER_TICKET", 3)
    if existing >= max_files:
        raise APIError(
            f"Maximum of {max_files} attachments per ticket",
            400,
            "VALIDATION_ERROR",
            {"attachments": [f"Maximum {max_files} files allowed"]},
        )

    upload_root = current_app.config["UPLOAD_FOLDER"]
    ticket_dir = os.path.join(upload_root, str(ticket.id))
    os.makedirs(ticket_dir, exist_ok=True)

    safe_name = secure_filename(file.filename)
    stored_name = f"{uuid.uuid4().hex}_{safe_name}"
    file_path = os.path.join(ticket_dir, stored_name)
    file.save(file_path)

    file.seek(0, os.SEEK_END)
    size = file.tell()

    attachment = Attachment(
        ticket_id=ticket.id,
        comment_id=comment_id,
        filename=safe_name,
        file_path=file_path,
        file_size=size,
        file_type=os.path.splitext(safe_name)[1].lower(),
    )
    db.session.add(attachment)
    return attachment
