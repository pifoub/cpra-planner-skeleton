
from fastapi import APIRouter, Body
from typing import Dict, Any
from ..models import CPRARequest, CPRARequestDraft, Timeline, LetterArtifact
from ..services.extractor import extract_scope
from ..services.rules import compute_timeline
from ..services.templates import render_letter
from ..services.tasksync import create_task_sync

router = APIRouter(tags=["cpra"])

@router.post("/extract/scope", response_model=CPRARequestDraft)
def extract_scope_api(payload: Dict[str, str] = Body(...)):
    """Extract a draft CPRA request scope from meeting notes."""
    notes = payload.get("notes", "")
    return extract_scope(notes)

@router.post("/timeline/calc", response_model=Timeline)
def timeline_calc_api(req: CPRARequest, adjustForHolidays: bool = True):
    """Compute statutory deadlines and milestones for a CPRA request."""
    return compute_timeline(req, adjust_for_holidays=adjustForHolidays)

@router.post("/letters/ack", response_model=LetterArtifact)
def letters_ack_api(data: Dict[str, Any] = Body(...)):
    """Render the acknowledgment letter using the provided context."""
    return {"html": render_letter("ack.html", data)}

@router.post("/letters/extension", response_model=LetterArtifact)
def letters_ext_api(data: Dict[str, Any] = Body(...)):
    """Render the extension letter using the provided context."""
    return {"html": render_letter("extension.html", data)}

@router.post("/tasks/sync")
def tasks_sync_api(data: Dict[str, Any] = Body(...)):
    """Create task synchronization artifacts such as calendar events."""
    return create_task_sync(data)
