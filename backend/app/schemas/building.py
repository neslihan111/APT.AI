from pydantic import BaseModel
from datetime import datetime


class BuildingCreate(BaseModel):
    name: str
    block_code: str | None = None
    floor_count: int | None = None


class BuildingResponse(BaseModel):
    id: int
    site_id: int
    name: str
    block_code: str | None = None
    floor_count: int | None = None
    created_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class ApartmentCreate(BaseModel):
    building_id: int
    apartment_number: str
    floor: int | None = None
    apt_type: str | None = None


class ApartmentResponse(BaseModel):
    id: int
    building_id: int
    apartment_number: str
    floor: int | None = None
    apt_type: str | None = None
    created_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class InviteCodeCreate(BaseModel):
    code: str
    expires_at: datetime | None = None


class InviteCodeResponse(BaseModel):
    id: int
    site_id: int
    code: str
    is_active: bool
    expires_at: datetime | None = None
    created_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }
