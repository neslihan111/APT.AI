from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Building(Base):
    """
    Represents a building / block within a site.
    Example: A Blok, B Blok, C Blok
    A site can have many buildings.
    """
    __tablename__ = "buildings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sites.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    block_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    floor_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    site = relationship("Site", back_populates="buildings")
    apartments = relationship("Apartment", back_populates="building", cascade="all, delete-orphan")
    users = relationship("User", back_populates="building")

    residents = relationship(
        "User",
        foreign_keys="User.building_id",
        back_populates="building"
    )