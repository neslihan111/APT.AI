from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db, get_current_admin
from app.models.user import User
from app.models.complaint import Complaint
from app.models.building import Building
from app.services.ai_service import generate_insights

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/dashboard-insights")
def get_insights(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Generate AI insights scoped to admin's site, including building-level analysis."""
    try:
        query = db.query(Complaint)
        if admin.site_id:
            query = query.filter(Complaint.site_id == admin.site_id)

        recent_complaints = query.order_by(Complaint.created_at.desc()).limit(30).all()

        if not recent_complaints:
            return {
                "summary": "Henüz sistemde yeterli şikayet bulunmuyor.",
                "repeating_issues": [],
                "suggestions": [],
                "building_analysis": [],
            }

        # Build per-building stats
        building_stats = {}
        for c in recent_complaints:
            bid = c.building_id
            if bid:
                if bid not in building_stats:
                    building = db.query(Building).filter(Building.id == bid).first()
                    building_stats[bid] = {
                        "name": building.name if building else f"Bina #{bid}",
                        "count": 0,
                        "categories": {},
                    }
                building_stats[bid]["count"] += 1
                cat = c.category or "Diğer"
                building_stats[bid]["categories"][cat] = building_stats[bid]["categories"].get(cat, 0) + 1

        building_analysis = [
            {
                "building": info["name"],
                "complaint_count": info["count"],
                "top_categories": sorted(info["categories"].items(), key=lambda x: x[1], reverse=True)[:3],
            }
            for info in building_stats.values()
        ]

        # Prepare data for AI with building context
        complaints_data = "\n".join([
            f"- [{c.category or 'Diğer'}] {c.title}: {c.description} (Durum: {c.status}, Bina ID: {c.building_id or 'N/A'})"
            for c in recent_complaints
        ])

        insights = generate_insights(complaints_data)
        insights["building_analysis"] = building_analysis

        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analiz sırasında hata: {str(e)}")
