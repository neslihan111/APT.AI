from pydantic import BaseModel
from datetime import datetime


class SiteCreate(BaseModel):
    name: str
    address: str | None = None
    city: str | None = None


class SiteResponse(BaseModel):
    id: int
    name: str
    address: str | None = None
    city: str | None = None
    current_admin_id: int | None = None
    created_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class SiteWithAdmin(SiteResponse):
    """Extended site response that includes admin details."""
    admin_name: str | None = None
    admin_email: str | None = None
    building_count: int = 0
    member_count: int = 0
