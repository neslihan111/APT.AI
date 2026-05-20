from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_db
from app.models.user import User
from app.models.site_invite_code import SiteInviteCode
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.db.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        existing_user = db.query(User).filter(User.email == data.email).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta zaten kayıtlı"
            )

        # Resolve site from invite code
        site_id = None
        if data.site_code:
            invite = db.query(SiteInviteCode).filter(
                SiteInviteCode.code == data.site_code,
                SiteInviteCode.is_active == True,
            ).first()

            if not invite:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Geçersiz veya süresi dolmuş davet kodu"
                )

            # Check expiry
            if invite.expires_at and invite.expires_at < datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Bu davet kodunun süresi dolmuş"
                )

            site_id = invite.site_id

        # SECURITY: Role is hardcoded to "resident" — never trust the client
        new_user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="resident",
            phone=data.phone,
            site_id=site_id,
            building_id=data.building_id,
            apartment_id=data.apartment_id,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "Kayıt başarılı",
            "user": {
                "id": new_user.id,
                "full_name": new_user.full_name,
                "email": new_user.email,
                "role": new_user.role,
                "site_id": new_user.site_id,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Kayıt sırasında hata oluştu: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz e-posta veya şifre"
            )

        if not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz e-posta veya şifre"
            )

        token = create_access_token(
            data={
                "sub": user.email,
                "role": user.role,
                "user_id": user.id,
                "site_id": user.site_id,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Giriş sırasında hata oluştu: {str(e)}"
        )


@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """List users — admin sees only their own site's users."""
    try:
        query = db.query(User)
        if admin.site_id:
            query = query.filter(User.site_id == admin.site_id)
        users = query.all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Kullanıcılar yüklenirken hata: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/site/{site_id}/buildings")
def get_site_buildings_public(site_id: int, db: Session = Depends(get_db)):
    """Public endpoint: get buildings for a site (used during registration)."""
    from app.models.building import Building
    buildings = db.query(Building).filter(Building.site_id == site_id).all()
    return [
        {
            "id": b.id,
            "name": b.name,
            "block_code": b.block_code,
        }
        for b in buildings
    ]


@router.get("/building/{building_id}/apartments")
def get_building_apartments_public(building_id: int, db: Session = Depends(get_db)):
    """Public endpoint: get apartments for a building (used during registration)."""
    from app.models.apartment import Apartment
    apartments = db.query(Apartment).filter(Apartment.building_id == building_id).all()
    return [
        {
            "id": a.id,
            "apartment_number": a.apartment_number,
            "floor": a.floor,
            "apt_type": a.apt_type,
        }
        for a in apartments
    ]


@router.post("/validate-invite-code")
def validate_invite_code(data: dict, db: Session = Depends(get_db)):
    """Public endpoint: validate an invite code and return site info."""
    code = data.get("code", "").strip()
    if not code:
        raise HTTPException(status_code=400, detail="Davet kodu gerekli")

    invite = db.query(SiteInviteCode).filter(
        SiteInviteCode.code == code,
        SiteInviteCode.is_active == True,
    ).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Geçersiz davet kodu")

    if invite.expires_at and invite.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Bu davet kodunun süresi dolmuş")

    from app.models.site import Site
    site = db.query(Site).filter(Site.id == invite.site_id).first()

    return {
        "valid": True,
        "site_id": site.id if site else None,
        "site_name": site.name if site else None,
    }