
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict

class Requester(BaseModel):
    name: str
    org: Optional[str] = None
    email: Optional[EmailStr] = None

class DateRange(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None

class Extension(BaseModel):
    apply: bool = False
    reasons: List[str] = Field(default_factory=list)

class CPRARequest(BaseModel):
    requester: Requester
    receivedDate: str
    description: str
    range: Optional[DateRange] = None
    departments: List[str] = Field(default_factory=list)
    extension: Extension = Field(default_factory=Extension)

class TimelineItem(BaseModel):
    label: str
    due: str

class Timeline(BaseModel):
    determinationDue: str
    extensionDue: Optional[str] = None
    milestones: List[TimelineItem] = Field(default_factory=list)

class CPRARequestDraft(BaseModel):
    request: CPRARequest
    confidences: Dict[str, float] = Field(default_factory=dict)

class LetterArtifact(BaseModel):
    html: str
    docxBase64: str = ""
    pdfBase64: str = ""
