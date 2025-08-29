
import re
from ..models import CPRARequestDraft, CPRARequest, Requester, DateRange, Extension

EMAIL_RE = re.compile(r'[\w\.-]+@[\w\.-]+')
DATE_RE = re.compile(
    r'(\b\d{4}-\d{2}-\d{2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b)',
    re.I,
)

def _first_email(text):
    """Return the first email address found in ``text`` or ``None``."""
    m = EMAIL_RE.search(text)
    return m.group(0) if m else None

def _first_date(text):
    """Return the first date-like string found in ``text`` or ``None``."""
    m = DATE_RE.search(text)
    if not m:
        return None
    raw = m.group(0)
    from dateutil import parser

    try:
        return parser.parse(raw).date().isoformat()
    except Exception:  # pragma: no cover - fallback for unparsable dates
        return raw

def extract_scope(notes: str) -> CPRARequestDraft:
    """Derive a draft CPRA request from free-form meeting notes."""
    email = _first_email(notes) or "requester@example.com"
    name = "Unknown Requester"
    m = re.search(
        r'(?:from|by|request(?:or|ed) by|requester)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        notes,
        re.I,
    )
    if m:
        name = m.group(1)
    received = _first_date(notes) or "2025-01-01"
    desc = "All emails related to agenda item"
    md = re.search(r'(?:request|records sought|subject)[:\s]+(.+)', notes, re.I)
    if md:
        desc = md.group(1).strip()
    draft = CPRARequest(
        requester=Requester(name=name, email=email),
        receivedDate=received,
        description=desc,
        range=DateRange(),
        departments=[],
    )
    return CPRARequestDraft(request=draft, confidences={"requester": 0.6, "receivedDate": 0.7, "description": 0.6})
