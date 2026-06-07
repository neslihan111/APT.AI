from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdateStatus(BaseModel):
    status: str

class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    site_id: Optional[int] = None
    building_id: Optional[int] = None
    apartment_id: Optional[int] = None
    status: str
    category: Optional[str] = None
    priority: Optional[str] = None
    ai_summary: Optional[str] = None
    suggestion: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
