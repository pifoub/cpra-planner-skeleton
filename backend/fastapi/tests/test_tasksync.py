"""Tests for the task synchronization service."""

from base64 import b64decode

from app.services.tasksync import create_task_sync


def test_create_task_sync_generates_events():
    """create_task_sync builds an ICS file with expected event names."""
    payload = {
        "timeline": {
            "determinationDue": "2025-01-27",
            "extensionDue": "2025-02-10",
            "milestones": [{"label": "Draft production", "due": "2025-02-10"}],
        }
    }
    result = create_task_sync(payload)
    ics = b64decode(result["icsFileBase64"]).decode()
    assert "CPRA Determination Due" in ics
    assert "CPRA Extension Due" in ics
    assert "CPRA Draft Production" in ics
