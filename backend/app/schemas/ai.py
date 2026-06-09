from pydantic import BaseModel
from typing import List, Optional

class AssistantRequest(BaseModel):
    message: str

class AssistantAction(BaseModel):
    type: str
    label: str
    target: Optional[str] = None

class AssistantResponse(BaseModel):
    answer: str
    actions: List[AssistantAction] = []
