
from pydantic import BaseModel, EmailStr
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
    reasons: List[str] = []

class CPRARequest(BaseModel):
    requester: Requester
    receivedDate: str
    description: str
    range: Optional[DateRange] = None
    departments: List[str] = []
    extension: Extension = Extension()

class TimelineItem(BaseModel):
    label: str
    due: str

class Timeline(BaseModel):
    determinationDue: str
    extensionDue: Optional[str] = None
    milestones: List[TimelineItem] = []

class CPRARequestDraft(BaseModel):
    request: CPRARequest
    confidences: Dict[str, float] = {}

class LetterArtifact(BaseModel):
    html: str
    docxBase64: str = ""
    pdfBase64: str = ""
