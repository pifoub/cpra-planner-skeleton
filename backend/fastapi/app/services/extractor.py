
import re
from ..models import CPRARequestDraft, CPRARequest, Requester, DateRange

def _parse_date(s: str) -> str:
    from dateutil import parser

    try:
        return parser.parse(s).date().isoformat()
    except Exception:
        return s


def extract_scope(notes: str) -> CPRARequestDraft:
    """Derive a draft CPRA request from a structured CPRA summary."""
    name = "Unknown Requester"
    email = "requester@example.com"
    m = re.search(r"Requester:\s*(.*?)\s*[\u2013\-]\s*(\S+)", notes)
    if m:
        name = m.group(1).strip()
        email = m.group(2).strip()
    received = "2025-01-01"
    m = re.search(r"Date Received:\s*([^\n]+)", notes)
    if m:
        received = _parse_date(m.group(1))
    matter = "No matter found"
    m = re.search(r"Matter:\s*([^\n]+)", notes)
    if m:
        matter = m.group(1).strip()
    range_start = None
    range_end = received
    m = re.search(r"Time Range:\s*([^\n]+)", notes)
    if m:
        parts = re.split(r"\s*[\u2013\-]\s*", m.group(1))
        if len(parts) == 2:
            range_start = _parse_date(parts[0])
            range_end = _parse_date(parts[1])
    record_types: list[str] = []
    record_text = ""
    m = re.search(r"Record Types:\s*([^\n]+)", notes)
    if m:
        record_text = m.group(1).strip()
        record_types = [s.strip() for s in re.split(r"[;,]", record_text) if s.strip()]
    custodians: list[str] = []
    m = re.search(r"Custodians:\s*([^\n]+)", notes)
    if m:
        custodians = [s.strip() for s in re.split(r"[;,]", m.group(1)) if s.strip()]
    pref = ""
    m = re.search(r"Preferred Format/Delivery:\s*([^\n]+)", notes)
    if m:
        pref = m.group(1).strip()
    draft = CPRARequest(
        requester=Requester(name=name, email=email),
        receivedDate=received,
        matter=matter,
        description=record_text,
        recordTypes=record_types,
        custodians=custodians,
        preferredFormatDelivery=pref,
        range=DateRange(start=range_start, end=range_end),
        departments=[],
    )
    return CPRARequestDraft(
        request=draft,
        confidences={"requester": 0.6, "receivedDate": 0.7, "matter": 0.6, "description": 0.6},
    )
