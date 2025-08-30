"""Tests for free-text scope extraction."""

from app.services.extractor import extract_scope


def test_extract_scope_parses_summary():
    """extract_scope interprets structured summary text."""
    notes = (
        "CPRA Request Summary (for tracker)\n\n"
        "Requester: John Doe – john.doe@example.com\n\n"
        "Date Received: Jan 5, 2025\n\n"
        "Matter: Budget Inquiry\n\n"
        "Time Range: Jan 1, 2024 – Jan 5, 2025\n\n"
        "Custodians: Finance, IT\n\n"
        "Record Types: Emails; texts\n\n"
        "Preferred Format/Delivery: Email\n\n"
        "Notes: none"
    )
    draft = extract_scope(notes)
    assert draft.request.requester.email == "john.doe@example.com"
    assert draft.request.requester.name == "John Doe"
    assert draft.request.receivedDate == "2025-01-05"
    assert draft.request.matter == "Budget Inquiry"
    assert draft.request.recordTypes == ["Emails", "texts"]
    assert draft.request.custodians == ["Finance", "IT"]
    assert draft.request.preferredFormatDelivery == "Email"
    assert draft.request.range.start == "2024-01-01"
    assert draft.request.range.end == "2025-01-05"


def test_extract_scope_handles_crlf():
    """Matter line should parse with CRLF endings."""
    notes = (
        "CPRA Request Summary (for tracker)\r\n\r\n"
        "Requester: Jane Roe – jane.roe@example.com\r\n\r\n"
        "Date Received: Jan 5, 2025\r\n\r\n"
        "Matter: Budget Inquiry\r\n\r\n"
        "Record Types: Emails\r\n"
    )
    draft = extract_scope(notes)
    assert draft.request.matter == "Budget Inquiry"
