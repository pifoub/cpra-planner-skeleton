"""Tests for rules computing CPRA timelines and dates."""

from datetime import date
import pytest
from fastapi import HTTPException

from app.models import CPRARequest, Requester, Extension
from app.services import rules


def test_to_date_parses_formats():
    """to_date accepts multiple input formats and rejects invalid ones."""
    assert rules.to_date("2025-01-05") == date(2025, 1, 5)
    assert rules.to_date("01/15/2025") == date(2025, 1, 15)
    assert rules.to_date("Jan 2, 2025") == date(2025, 1, 2)
    with pytest.raises(HTTPException):
        rules.to_date("not-a-date")


def test_roll_forward_weekends():
    """roll_forward moves weekend dates to the following Monday."""
    assert rules.roll_forward(date(2025, 1, 11)) == date(2025, 1, 13)
    assert rules.roll_forward(date(2025, 1, 12)) == date(2025, 1, 13)
    assert rules.roll_forward(date(2025, 1, 13)) == date(2025, 1, 13)


def test_compute_timeline_with_extension():
    """compute_timeline returns correct deadlines when extensions apply."""
    req = CPRARequest(
        requester=Requester(name="Jane", email="jane@example.com"),
        receivedDate="2025-01-15",
        subject="Budget",
        description="Budget docs",
        extension=Extension(apply=True),
    )
    tl = rules.compute_timeline(req)
    assert tl.determinationDue == "2025-01-27"
    assert tl.extensionDue == "2025-02-10"
    labels = [m.label for m in tl.milestones]
    assert "Draft production" in labels
    draft_due = next(m.due for m in tl.milestones if m.label == "Draft production")
    assert draft_due == "2025-02-10"
