from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    register_type: str = "resident"  # "resident" or "manager"
    full_name: str
    email: EmailStr
    password: str

    site_code: str | None = None
    building_id: int | None = None
    apartment_id: int | None = None
    phone: str | None = None
    
    # Manager fields
    site_name: str | None = None
    city: str | None = None
    address: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SiteInfo(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class BuildingInfo(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class ApartmentInfo(BaseModel):
    id: int
    apartment_number: str
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    site_id: int | None = None
    building_id: int | None = None
    apartment_id: int | None = None
    phone: str | None = None
    site: SiteInfo | None = None
    building: BuildingInfo | None = None
    apartment: ApartmentInfo | None = None

    model_config = {
        "from_attributes": True
    }