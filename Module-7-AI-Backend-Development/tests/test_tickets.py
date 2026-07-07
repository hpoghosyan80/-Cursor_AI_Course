"""Ticket management tests (FR-001–FR-015)."""

from datetime import datetime, timedelta, timezone

from app.extensions import db
from app.models import Ticket, TicketStatus, User, UserRole


class TestTicketCreation:
    def test_create_ticket(self, client, customer_headers, sample_ticket_payload):
        resp = client.post(
            "/api/tickets/",
            headers=customer_headers,
            json=sample_ticket_payload,
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["status"] == "open"
        assert data["ticket_number"].startswith("TICK-")

    def test_validation_short_subject(self, client, customer_headers, sample_ticket_payload):
        sample_ticket_payload["subject"] = "Hi"
        resp = client.post(
            "/api/tickets/",
            headers=customer_headers,
            json=sample_ticket_payload,
        )
        assert resp.status_code == 400
        assert resp.get_json()["code"] == "VALIDATION_ERROR"

    def test_validation_short_description(self, client, customer_headers, sample_ticket_payload):
        sample_ticket_payload["description"] = "Too short"
        resp = client.post(
            "/api/tickets/",
            headers=customer_headers,
            json=sample_ticket_payload,
        )
        assert resp.status_code == 400

    def test_invalid_email(self, client, customer_headers, sample_ticket_payload):
        sample_ticket_payload["customer_email"] = "not-an-email"
        resp = client.post(
            "/api/tickets/",
            headers=customer_headers,
            json=sample_ticket_payload,
        )
        assert resp.status_code == 400


class TestTicketAssignment:
    def test_admin_assign(self, client, admin_headers, ticket, agent):
        resp = client.post(
            f"/api/tickets/{ticket['id']}/assign",
            headers=admin_headers,
            json={"assigned_to_id": agent.id},
        )
        assert resp.status_code == 200
        assert resp.get_json()["status"] == "assigned"
        assert resp.get_json()["assigned_to_id"] == agent.id

    def test_auto_assign(self, client, admin_headers, customer_headers, sample_ticket_payload, agent):
        resp = client.post(
            "/api/tickets/",
            headers=customer_headers,
            json={**sample_ticket_payload, "auto_assign": True},
        )
        ticket = resp.get_json()
        client.post(
            f"/api/tickets/{ticket['id']}/assign",
            headers=admin_headers,
            json={"auto_assign": True},
        )
        updated = client.get(
            f"/api/tickets/{ticket['id']}", headers=admin_headers
        ).get_json()
        assert updated["assigned_to_id"] == agent.id

    def test_customer_cannot_assign(self, client, customer_headers, ticket, agent):
        resp = client.post(
            f"/api/tickets/{ticket['id']}/assign",
            headers=customer_headers,
            json={"assigned_to_id": agent.id},
        )
        assert resp.status_code == 403


class TestTicketStatus:
    def test_valid_transition(self, client, admin_headers, ticket, agent):
        client.post(
            f"/api/tickets/{ticket['id']}/assign",
            headers=admin_headers,
            json={"assigned_to_id": agent.id},
        )
        resp = client.put(
            f"/api/tickets/{ticket['id']}/status",
            headers=admin_headers,
            json={"status": "in_progress"},
        )
        assert resp.status_code == 200
        assert resp.get_json()["status"] == "in_progress"

    def test_invalid_transition(self, client, admin_headers, ticket):
        resp = client.put(
            f"/api/tickets/{ticket['id']}/status",
            headers=admin_headers,
            json={"status": "resolved"},
        )
        assert resp.status_code == 400

    def test_customer_reopen_within_window(self, client, admin_headers, customer_headers, ticket, agent):
        client.post(
            f"/api/tickets/{ticket['id']}/assign",
            headers=admin_headers,
            json={"assigned_to_id": agent.id},
        )
        for status in ("in_progress", "resolved", "closed"):
            client.put(
                f"/api/tickets/{ticket['id']}/status",
                headers=admin_headers,
                json={"status": status},
            )
        resp = client.put(
            f"/api/tickets/{ticket['id']}/status",
            headers=customer_headers,
            json={"status": "reopened"},
        )
        assert resp.status_code == 200
        assert resp.get_json()["status"] == "reopened"

    def test_reopen_blocked_after_7_days(self, client, admin_headers, ticket):
        t = db.session.get(Ticket, ticket["id"])
        t.status = TicketStatus.CLOSED
        t.closed_at = datetime.now(timezone.utc) - timedelta(days=8)
        db.session.commit()

        resp = client.put(
            f"/api/tickets/{ticket['id']}/status",
            headers=admin_headers,
            json={"status": "reopened"},
        )
        assert resp.status_code == 400


class TestComments:
    def test_add_comment(self, client, customer_headers, agent_headers, ticket):
        resp = client.post(
            f"/api/tickets/{ticket['id']}/comments",
            headers=customer_headers,
            json={"content": "Here is more detail about the login issue."},
        )
        assert resp.status_code == 201

        listed = client.get(
            f"/api/tickets/{ticket['id']}/comments",
            headers=agent_headers,
        ).get_json()
        assert len(listed) == 1

    def test_internal_comment_hidden_from_customer(
        self, client, admin_headers, customer_headers, ticket
    ):
        client.post(
            f"/api/tickets/{ticket['id']}/comments",
            headers=admin_headers,
            json={"content": "Internal investigation notes", "is_internal": True},
        )
        public = client.post(
            f"/api/tickets/{ticket['id']}/comments",
            headers=customer_headers,
            json={"content": "Customer visible comment here."},
        )
        assert public.status_code == 201

        customer_view = client.get(
            f"/api/tickets/{ticket['id']}/comments",
            headers=customer_headers,
        ).get_json()
        assert len(customer_view) == 1

    def test_customer_cannot_add_internal(
        self, client, customer_headers, ticket
    ):
        resp = client.post(
            f"/api/tickets/{ticket['id']}/comments",
            headers=customer_headers,
            json={"content": "Trying internal", "is_internal": True},
        )
        assert resp.status_code == 403


class TestAttachments:
    def test_upload_attachment(self, client, customer_headers, ticket, pdf_file):
        data = {"file": (pdf_file[0], pdf_file[1])}
        resp = client.post(
            f"/api/tickets/{ticket['id']}/attachments",
            headers=customer_headers,
            data=data,
            content_type="multipart/form-data",
        )
        assert resp.status_code == 201

    def test_reject_invalid_type(self, client, customer_headers, ticket):
        import io

        data = {"file": (io.BytesIO(b"evil"), "virus.exe")}
        resp = client.post(
            f"/api/tickets/{ticket['id']}/attachments",
            headers=customer_headers,
            data=data,
            content_type="multipart/form-data",
        )
        assert resp.status_code == 400


class TestHistory:
    def test_history_logged(self, client, admin_headers, ticket):
        resp = client.get(
            f"/api/tickets/{ticket['id']}/history",
            headers=admin_headers,
        )
        assert resp.status_code == 200
        actions = [h["action"] for h in resp.get_json()]
        assert "created" in actions


class TestRBAC:
    def test_customer_sees_own_tickets_only(
        self, client, customer_headers, admin_headers, ticket, sample_ticket_payload
    ):
        other = User(name="Other", email="other@test.com", role=UserRole.CUSTOMER)
        other.set_password("password123")
        db.session.add(other)
        db.session.commit()

        client.post(
            "/api/tickets/",
            headers={"Authorization": customer_headers["Authorization"]},
            json={**sample_ticket_payload, "customer_email": "other@test.com"},
        )

        listed = client.get("/api/tickets/", headers=customer_headers).get_json()
        assert all(
            t["customer_email"] == "customer@test.com" for t in listed["items"]
        )

    def test_admin_delete(self, client, admin_headers, ticket):
        resp = client.delete(
            f"/api/tickets/{ticket['id']}",
            headers=admin_headers,
        )
        assert resp.status_code == 204
