from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

class Due(Base):
    __tablename__ = "dues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    site_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("sites.id"), nullable=True, index=True
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    due_date: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. '2026-05-01'
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="unpaid")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User")
    site = relationship("Site")
