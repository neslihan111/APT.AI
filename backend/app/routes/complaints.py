from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db, get_current_user, get_current_admin
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintUpdateStatus
from app.services.ai_service import analyze_complaint

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintResponse)
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_complaint = Complaint(
            user_id=current_user.id,
            site_id=current_user.site_id,
            building_id=current_user.building_id,
            apartment_id=current_user.apartment_id,
            title=data.title,
            description=data.description,
        )

        # Analyze with Gemini
        analysis_result = analyze_complaint(data.title, data.description)
        if analysis_result:
            new_complaint.category = analysis_result.get("category")
            new_complaint.priority = analysis_result.get("priority")
            new_complaint.ai_summary = analysis_result.get("summary")

        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        return new_complaint
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Şikayet oluşturulurken hata: {str(e)}")

@router.get("/my", response_model=List[ComplaintResponse])
def get_my_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        complaints = db.query(Complaint).filter(Complaint.user_id == current_user.id).order_by(Complaint.created_at.desc()).all()
        return complaints
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Şikayetler yüklenirken hata: {str(e)}")

@router.get("", response_model=List[ComplaintResponse])
def get_all_complaints(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Admin sees only their own site's complaints."""
    try:
        query = db.query(Complaint)
        if admin.site_id:
            query = query.filter(Complaint.site_id == admin.site_id)
        complaints = query.order_by(Complaint.created_at.desc()).all()
        return complaints
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Şikayetler yüklenirken hata: {str(e)}")

@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(complaint_id: int, data: ComplaintUpdateStatus, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    try:
        query = db.query(Complaint).filter(Complaint.id == complaint_id)
        if admin.site_id:
            query = query.filter(Complaint.site_id == admin.site_id)
        complaint = query.first()

        if not complaint:
            raise HTTPException(status_code=404, detail="Şikayet bulunamadı")

        complaint.status = data.status
        db.commit()
        db.refresh(complaint)
        return complaint
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Şikayet güncellenirken hata: {str(e)}")
