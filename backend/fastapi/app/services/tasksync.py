
import base64
from datetime import datetime
from uuid import uuid4

def _ics_event(dtstart_date: str, summary: str, uid: str | None = None, description: str = ""):
    """Generate a minimal ICS ``VEVENT`` block."""
    uid = uid or str(uuid4())
    return (
        f"BEGIN:VEVENT\n"
        f"UID:{uid}\n"
        f"DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}\n"
        f"DTSTART;VALUE=DATE:{dtstart_date.replace('-', '')}\n"
        f"SUMMARY:{summary}\n"
        f"DESCRIPTION:{description}\nEND:VEVENT"
    )

def create_task_sync(payload: dict):
    """Create calendar events from a timeline and return an ICS file."""
    tl = payload.get("timeline", {})
    events = []
    if tl.get("determinationDue"):
        events.append(_ics_event(tl["determinationDue"], "CPRA Determination Due"))
    if tl.get("extensionDue"):
        events.append(_ics_event(tl["extensionDue"], "CPRA Extension Due"))
    for m in tl.get("milestones", []):
        if m.get("label") == "Draft production":
            events.append(_ics_event(m["due"], "CPRA Draft Production"))
    ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CPRA Planner//EN\n" + "\n".join(events) + "\nEND:VCALENDAR\n"
    return {
        "createdEvents": [{"provider": "ics", "id": "local", "url": ""}],
        "icsFileBase64": base64.b64encode(ics.encode()).decode(),
        "emailsSent": 0,
    }
