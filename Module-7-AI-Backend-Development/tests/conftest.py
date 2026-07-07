"""Shared pytest fixtures."""

import io

import pytest

from app import create_app
from app.config import TestingConfig
from app.extensions import db
from app.models import AvailabilityStatus, User, UserRole


@pytest.fixture
def app():
    application = create_app(TestingConfig)
    with application.app_context():
        db.create_all()
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def _auth_headers(client, email, password):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    token = resp.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def customer(client):
    user = User(name="Customer One", email="customer@test.com", role=UserRole.CUSTOMER)
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def agent(client):
    user = User(
        name="Agent Smith",
        email="agent@test.com",
        role=UserRole.AGENT,
        availability_status=AvailabilityStatus.AVAILABLE,
        expertise_areas=["technical", "billing"],
    )
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def admin(client):
    user = User(
        name="Admin User",
        email="admin@test.com",
        role=UserRole.ADMIN,
        availability_status=AvailabilityStatus.AVAILABLE,
    )
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def customer_headers(client, customer):
    return _auth_headers(client, "customer@test.com", "password123")


@pytest.fixture
def agent_headers(client, agent):
    return _auth_headers(client, "agent@test.com", "password123")


@pytest.fixture
def admin_headers(client, admin):
    return _auth_headers(client, "admin@test.com", "password123")


@pytest.fixture
def sample_ticket_payload():
    return {
        "subject": "Cannot login to my account",
        "description": "I have been unable to login since yesterday morning.",
        "priority": "high",
        "category": "technical",
        "customer_email": "customer@test.com",
    }


@pytest.fixture
def ticket(client, customer_headers, sample_ticket_payload):
    resp = client.post(
        "/api/tickets/",
        headers=customer_headers,
        json=sample_ticket_payload,
    )
    return resp.get_json()


@pytest.fixture
def pdf_file():
  return (io.BytesIO(b"%PDF-1.4 test content"), "report.pdf")
