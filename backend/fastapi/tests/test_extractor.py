"""Tests for free-text scope extraction."""

from app.services.extractor import extract_scope


def test_extract_scope_parses_notes():
    """extract_scope interprets meeting notes into structured data."""
    notes = (
        "Meeting notes from John Doe <john.doe@example.com> on 2025-01-05. "
        "Records sought: Budget documents."
    )
    draft = extract_scope(notes)
    assert draft.request.requester.email == "john.doe@example.com"
    assert draft.request.requester.name == "John Doe"
    assert draft.request.receivedDate == "2025-01-05"
    assert draft.request.description == "Budget documents."
