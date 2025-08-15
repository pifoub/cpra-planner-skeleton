
import base64
from datetime import datetime
from uuid import uuid4

def _ics_event(dtstart_date: str, summary: str, uid: str=None, description: str=""):
    uid = uid or str(uuid4())
    return f"""BEGIN:VEVENT
UID:{uid}
DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
DTSTART;VALUE=DATE:{dtstart_date.replace('-','')}
SUMMARY:{summary}
DESCRIPTION:{description}
END:VEVENT"""

def create_task_sync(payload: dict):
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
    return {"createdEvents":[{"provider":"ics","id":"local","url":""}],"icsFileBase64":base64.b64encode(ics.encode()).decode(),"emailsSent":0}
