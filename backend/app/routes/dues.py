from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db, get_current_user, get_current_admin
from app.models.user import User
from app.models.due import Due
from app.schemas.due import DueCreate, DueResponse, DueUpdateStatus

router = APIRouter(prefix="/dues", tags=["Dues"])

@router.get("/my", response_model=List[DueResponse])
def get_my_dues(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return db.query(Due).filter(Due.user_id == current_user.id).order_by(Due.due_date.desc()).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aidatlar yüklenirken hata: {str(e)}")

@router.get("", response_model=List[DueResponse])
def get_all_dues(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Admin sees only their own site's dues."""
    try:
        query = db.query(Due)
        if admin.site_id:
            query = query.filter(Due.site_id == admin.site_id)
        return query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aidatlar yüklenirken hata: {str(e)}")

@router.post("", response_model=DueResponse)
def create_due(data: DueCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    try:
        # Verify user belongs to admin's site
        target_user = db.query(User).filter(User.id == data.user_id).first()
        if not target_user:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        if admin.site_id and target_user.site_id != admin.site_id:
            raise HTTPException(status_code=403, detail="Bu kullanıcı sizin sitenize ait değil")

        new_due = Due(
            user_id=data.user_id,
            site_id=admin.site_id,
            amount=data.amount,
            due_date=data.due_date,
        )
        db.add(new_due)
        db.commit()
        db.refresh(new_due)
        return new_due
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Aidat oluşturulurken hata: {str(e)}")

@router.put("/{due_id}/status", response_model=DueResponse)
def update_due_status(due_id: int, data: DueUpdateStatus, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    try:
        query = db.query(Due).filter(Due.id == due_id)
        if admin.site_id:
            query = query.filter(Due.site_id == admin.site_id)
        due = query.first()

        if not due:
            raise HTTPException(status_code=404, detail="Aidat bulunamadı")

        due.status = data.status
        db.commit()
        db.refresh(due)
        return due
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Aidat güncellenirken hata: {str(e)}")
