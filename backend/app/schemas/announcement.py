from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    content: str

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementResponse(AnnouncementBase):
    id: int
    summary: Optional[str] = None
    site_id: Optional[int] = None
    created_by: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
