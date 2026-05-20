from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.deps import get_current_admin
from app.models.user import User
from app.models.site import Site
from app.models.building import Building
from app.models.apartment import Apartment
from app.models.site_invite_code import SiteInviteCode
from app.schemas.admin import AdminTransferRequest
from app.schemas.site import SiteCreate, SiteResponse, SiteWithAdmin
from app.schemas.building import (
    BuildingCreate, BuildingResponse,
    ApartmentCreate, ApartmentResponse,
    InviteCodeCreate, InviteCodeResponse,
)
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============================================================
# ADMIN TRANSFER
# ============================================================

@router.put("/transfer")
def transfer_admin(
    data: AdminTransferRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Transfer admin role to another user within the same site.

    Rules:
    - Only the current admin can perform this action
    - Self-transfer is not allowed
    - Only one active admin per site at a time
    - Runs inside a transaction for atomicity
    """
    try:
        # Prevent self-transfer
        if current_admin.id == data.new_admin_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kendinize yöneticilik devredemezsiniz"
            )

        new_admin = db.query(User).filter(User.id == data.new_admin_id).first()
        if not new_admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı"
            )

        # Verify same site
        if current_admin.site_id and new_admin.site_id != current_admin.site_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Yöneticilik sadece aynı siteye ait kullanıcılara devredilebilir"
            )

        # Transaction: swap roles
        current_admin.role = "resident"
        new_admin.role = "admin"

        if current_admin.site_id:
            site = db.query(Site).filter(Site.id == current_admin.site_id).first()
            if site:
                site.current_admin_id = new_admin.id

        db.commit()
        db.refresh(current_admin)
        db.refresh(new_admin)

        return {
            "message": "Yöneticilik başarıyla devredildi",
            "old_admin": {"id": current_admin.id, "full_name": current_admin.full_name, "role": current_admin.role},
            "new_admin": {"id": new_admin.id, "full_name": new_admin.full_name, "role": new_admin.role},
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Yönetici devretme sırasında hata: {str(e)}")


# ============================================================
# SITE MANAGEMENT
# ============================================================

@router.get("/site", response_model=SiteWithAdmin)
def get_current_site(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get current admin's site information."""
    try:
        if not current_admin.site_id:
            return SiteWithAdmin(
                id=0, name="Henüz site atanmamış",
                current_admin_id=current_admin.id,
                admin_name=current_admin.full_name,
                admin_email=current_admin.email,
            )

        site = db.query(Site).filter(Site.id == current_admin.site_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site bulunamadı")

        building_count = db.query(Building).filter(Building.site_id == site.id).count()
        member_count = db.query(User).filter(User.site_id == site.id).count()

        return SiteWithAdmin(
            id=site.id, name=site.name, address=site.address, city=site.city,
            current_admin_id=site.current_admin_id, created_at=site.created_at,
            admin_name=current_admin.full_name, admin_email=current_admin.email,
            building_count=building_count, member_count=member_count,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Site bilgisi yüklenirken hata: {str(e)}")


@router.post("/site", response_model=SiteResponse)
def create_site(data: SiteCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Create a new site and assign the current admin to it."""
    try:
        new_site = Site(
            name=data.name, address=data.address, city=data.city,
            current_admin_id=current_admin.id,
        )
        db.add(new_site)
        db.flush()

        current_admin.site_id = new_site.id
        db.commit()
        db.refresh(new_site)
        return new_site
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Site oluşturulurken hata: {str(e)}")


# ============================================================
# BUILDING MANAGEMENT
# ============================================================

@router.get("/buildings", response_model=list[BuildingResponse])
def get_buildings(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get all buildings for the current admin's site."""
    try:
        if not current_admin.site_id:
            return []
        return db.query(Building).filter(Building.site_id == current_admin.site_id).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Binalar yüklenirken hata: {str(e)}")


@router.post("/buildings", response_model=BuildingResponse)
def create_building(data: BuildingCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Create a new building in the current admin's site."""
    try:
        if not current_admin.site_id:
            raise HTTPException(status_code=400, detail="Önce bir site oluşturmalısınız")

        new_building = Building(
            site_id=current_admin.site_id,
            name=data.name, block_code=data.block_code, floor_count=data.floor_count,
        )
        db.add(new_building)
        db.commit()
        db.refresh(new_building)
        return new_building
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Bina oluşturulurken hata: {str(e)}")


@router.delete("/buildings/{building_id}")
def delete_building(building_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Delete a building (admin's site only)."""
    try:
        building = db.query(Building).filter(
            Building.id == building_id, Building.site_id == current_admin.site_id
        ).first()
        if not building:
            raise HTTPException(status_code=404, detail="Bina bulunamadı")
        db.delete(building)
        db.commit()
        return {"message": "Bina silindi"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Bina silinirken hata: {str(e)}")


# ============================================================
# APARTMENT MANAGEMENT
# ============================================================

@router.get("/buildings/{building_id}/apartments", response_model=list[ApartmentResponse])
def get_apartments(building_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get all apartments in a building (admin's site only)."""
    try:
        # Verify building belongs to admin's site
        building = db.query(Building).filter(
            Building.id == building_id, Building.site_id == current_admin.site_id
        ).first()
        if not building:
            raise HTTPException(status_code=404, detail="Bina bulunamadı")
        return db.query(Apartment).filter(Apartment.building_id == building_id).all()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Daireler yüklenirken hata: {str(e)}")


@router.post("/apartments", response_model=ApartmentResponse)
def create_apartment(data: ApartmentCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Create a new apartment in a building (admin's site only)."""
    try:
        # Verify building belongs to admin's site
        building = db.query(Building).filter(
            Building.id == data.building_id, Building.site_id == current_admin.site_id
        ).first()
        if not building:
            raise HTTPException(status_code=404, detail="Bina bulunamadı veya bu siteye ait değil")

        new_apt = Apartment(
            building_id=data.building_id,
            apartment_number=data.apartment_number,
            floor=data.floor, apt_type=data.apt_type,
        )
        db.add(new_apt)
        db.commit()
        db.refresh(new_apt)
        return new_apt
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Daire oluşturulurken hata: {str(e)}")


@router.delete("/apartments/{apartment_id}")
def delete_apartment(apartment_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Delete an apartment (admin's site only)."""
    try:
        apt = db.query(Apartment).join(Building).filter(
            Apartment.id == apartment_id, Building.site_id == current_admin.site_id
        ).first()
        if not apt:
            raise HTTPException(status_code=404, detail="Daire bulunamadı")
        db.delete(apt)
        db.commit()
        return {"message": "Daire silindi"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Daire silinirken hata: {str(e)}")


# ============================================================
# INVITE CODE MANAGEMENT
# ============================================================

@router.get("/invite-codes", response_model=list[InviteCodeResponse])
def get_invite_codes(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get all invite codes for the current admin's site."""
    try:
        if not current_admin.site_id:
            return []
        return db.query(SiteInviteCode).filter(SiteInviteCode.site_id == current_admin.site_id).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Davet kodları yüklenirken hata: {str(e)}")


@router.post("/invite-codes", response_model=InviteCodeResponse)
def create_invite_code(data: InviteCodeCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Create a new invite code for the current admin's site."""
    try:
        if not current_admin.site_id:
            raise HTTPException(status_code=400, detail="Önce bir site oluşturmalısınız")

        # Check uniqueness
        existing = db.query(SiteInviteCode).filter(SiteInviteCode.code == data.code).first()
        if existing:
            raise HTTPException(status_code=400, detail="Bu kod zaten kullanımda")

        new_code = SiteInviteCode(
            site_id=current_admin.site_id,
            code=data.code.upper(),
            expires_at=data.expires_at,
        )
        db.add(new_code)
        db.commit()
        db.refresh(new_code)
        return new_code
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Davet kodu oluşturulurken hata: {str(e)}")


@router.put("/invite-codes/{code_id}/deactivate")
def deactivate_invite_code(code_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Deactivate an invite code."""
    try:
        invite = db.query(SiteInviteCode).filter(
            SiteInviteCode.id == code_id, SiteInviteCode.site_id == current_admin.site_id
        ).first()
        if not invite:
            raise HTTPException(status_code=404, detail="Davet kodu bulunamadı")
        invite.is_active = False
        db.commit()
        return {"message": "Davet kodu devre dışı bırakıldı"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"İşlem sırasında hata: {str(e)}")


# ============================================================
# RESIDENTS
# ============================================================

@router.get("/residents", response_model=list[UserResponse])
def get_site_residents(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get all residents (non-admin), filtered by site."""
    try:
        query = db.query(User).filter(User.id != current_admin.id)
        if current_admin.site_id:
            query = query.filter(User.site_id == current_admin.site_id)
        return query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sakinler yüklenirken hata: {str(e)}")
