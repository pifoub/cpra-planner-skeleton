
"""Pydantic models describing API payloads and artifacts for the CPRA planner."""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict

class Requester(BaseModel):
    """Information about the person making a CPRA request."""

    name: str
    org: Optional[str] = None
    email: Optional[EmailStr] = None

class DateRange(BaseModel):
    """Optional start and end dates for the records being requested."""

    start: Optional[str] = None
    end: Optional[str] = None

class Extension(BaseModel):
    """Whether a deadline extension is applied and the reasons for it."""

    apply: bool = False
    reasons: List[str] = Field(default_factory=list)

class CPRARequest(BaseModel):
    """A complete CPRA request as provided by a requester."""

    requester: Requester
    receivedDate: str
    subject: str = ""
    description: str
    range: Optional[DateRange] = None
    departments: List[str] = Field(default_factory=list)
    extension: Extension = Field(default_factory=Extension)

class TimelineItem(BaseModel):
    """Single milestone in the processing timeline."""

    label: str
    due: str

class Timeline(BaseModel):
    """Collection of statutory deadlines and milestone dates."""

    determinationDue: str
    extensionDue: Optional[str] = None
    milestones: List[TimelineItem] = Field(default_factory=list)

class CPRARequestDraft(BaseModel):
    """Draft CPRA request with confidence scores for extracted fields."""

    request: CPRARequest
    confidences: Dict[str, float] = Field(default_factory=dict)

class LetterArtifact(BaseModel):
    """Rendered letter output in various formats."""

    html: str
    docxBase64: str = ""
    pdfBase64: str = ""
