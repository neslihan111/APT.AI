from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Site(Base):
    """
    Represents a residential complex / site.
    Example: "Green Park Residence", "Yıldız Life Sitesi"
    """
    __tablename__ = "sites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    current_admin_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    current_admin = relationship(
        "User", foreign_keys=[current_admin_id], back_populates="managed_site"
    )
    members = relationship(
        "User", foreign_keys="User.site_id", back_populates="site"
    )
    buildings = relationship("Building", back_populates="site", cascade="all, delete-orphan")
    invite_codes = relationship("SiteInviteCode", back_populates="site", cascade="all, delete-orphan")
