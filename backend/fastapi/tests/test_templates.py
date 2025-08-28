from app.models import CPRARequest, Requester, Timeline, Extension
from app.services.templates import render_letter


def test_render_letter_ack_uses_nl2br():
    req = CPRARequest(
        requester=Requester(name="Jane", email="jane@example.com"),
        receivedDate="2025-01-01",
        description="Line1\nLine2",
    )
    tl = Timeline(determinationDue="2025-01-10")
    html = render_letter("ack.html", {"request": req, "timeline": tl})
    assert "Line1<br>\nLine2" in html
    assert "2025-01-10" in html


def test_render_letter_extension_includes_reason():
    req = CPRARequest(
        requester=Requester(name="Jane", email="jane@example.com"),
        receivedDate="2025-01-01",
        description="Test",
        extension=Extension(apply=True, reasons=["need more time"]),
    )
    tl = Timeline(determinationDue="2025-01-10", extensionDue="2025-01-24")
    html = render_letter("extension.html", {"request": req, "timeline": tl})
    assert "need more time" in html
    assert "2025-01-24" in html
