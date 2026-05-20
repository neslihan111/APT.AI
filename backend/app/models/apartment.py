from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Apartment(Base):
    """
    Represents a single apartment/unit within a building.
    Example: Daire 12A, Kat 5, Tip 3+1
    A building can have many apartments.
    """
    __tablename__ = "apartments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    building_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("buildings.id"), nullable=False, index=True
    )
    apartment_number: Mapped[str] = mapped_column(String(20), nullable=False)
    floor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    apt_type: Mapped[str | None] = mapped_column(String(20), nullable=True)  # e.g. "3+1", "2+1"
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    building = relationship("Building", back_populates="apartments")
    residents = relationship("User", back_populates="apartment")

    residents = relationship(
    "User",
    foreign_keys="User.apartment_id",
    back_populates="apartment"
)
