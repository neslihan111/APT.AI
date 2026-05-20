from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db, get_current_user, get_current_admin
from app.models.user import User
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse
from app.services.ai_service import summarize_announcement

router = APIRouter(prefix="/announcements", tags=["Announcements"])

@router.get("", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Residents see only their own site's announcements."""
    try:
        query = db.query(Announcement)
        if current_user.site_id:
            query = query.filter(Announcement.site_id == current_user.site_id)
        return query.order_by(Announcement.created_at.desc()).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Duyurular yüklenirken hata: {str(e)}")

@router.post("", response_model=AnnouncementResponse)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    try:
        new_announcement = Announcement(
            title=data.title,
            content=data.content,
            site_id=admin.site_id,
            created_by=admin.id,
        )

        # Analyze with Gemini
        ai_summary = summarize_announcement(data.content)
        if ai_summary:
            new_announcement.summary = ai_summary

        db.add(new_announcement)
        db.commit()
        db.refresh(new_announcement)
        return new_announcement
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Duyuru oluşturulurken hata: {str(e)}")
