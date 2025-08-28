
from datetime import date, timedelta
from fastapi import HTTPException
try:
    from dateutil import parser as dateparser
except ImportError:  # pragma: no cover - optional dependency
    dateparser = None
from ..models import CPRARequest, Timeline, TimelineItem

def to_date(s: str) -> date:
    """Convert a string to a ``date``.

    Supports ISO format (``YYYY-MM-DD``), US-style ``MM/DD/YYYY`` and falls back
    to ``dateutil.parser`` for more flexible parsing. Raises ``HTTPException`` if
    the format is unrecognized.
    """

    try:
        return date.fromisoformat(s)
    except ValueError:
        parts = s.split('/')
        if len(parts) == 3:
            try:
                month, day, year = (int(p) for p in parts)
                return date(year, month, day)
            except ValueError:
                pass
        if dateparser is not None:
            try:
                return dateparser.parse(s).date()
            except (ValueError, OverflowError):
                pass
        raise HTTPException(status_code=400, detail=f"Unrecognized date format: {s}")

def roll_forward(d: date) -> date:
    if d.weekday() == 5: return d + timedelta(days=2) # Sat->Mon
    if d.weekday() == 6: return d + timedelta(days=1) # Sun->Mon
    return d

def compute_timeline(req: CPRARequest, adjust_for_holidays: bool=True) -> Timeline:
    received = to_date(req.receivedDate)
    determination = received + timedelta(days=10)
    extension_due = None
    if req.extension.apply:
        extension_due = determination + timedelta(days=14)
    if adjust_for_holidays:
        determination = roll_forward(determination)
        if extension_due: extension_due = roll_forward(extension_due)
    prod_base = extension_due or determination
    milestones = [
        TimelineItem(label="Search kickoff", due=str(roll_forward(received + timedelta(days=1)))),
        TimelineItem(label="Privilege review", due=str(roll_forward(prod_base - timedelta(days=3)))),
        TimelineItem(label="Draft production", due=str(roll_forward(prod_base - timedelta(days=1)))),
    ]
    return Timeline(determinationDue=str(determination), extensionDue=(str(extension_due) if extension_due else None), milestones=milestones)
