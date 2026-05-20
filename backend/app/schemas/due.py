from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DueBase(BaseModel):
    user_id: int
    amount: float
    due_date: str

class DueCreate(DueBase):
    pass

class DueUpdateStatus(BaseModel):
    status: str

class DueResponse(DueBase):
    id: int
    site_id: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
