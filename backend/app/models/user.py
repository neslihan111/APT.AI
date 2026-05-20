from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="resident"
    )

    site_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("sites.id"),
        nullable=True
    )

    building_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("buildings.id"),
        nullable=True
    )

    apartment_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("apartments.id"),
        nullable=True
    )

    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    site = relationship(
        "Site",
        foreign_keys=[site_id],
        back_populates="members"
    )

    managed_site = relationship(
        "Site",
        foreign_keys="Site.current_admin_id",
        back_populates="current_admin",
        uselist=False
    )

    building = relationship(
        "Building",
        foreign_keys=[building_id],
        back_populates="residents"
    )

    apartment = relationship(
        "Apartment",
        foreign_keys=[apartment_id],
        back_populates="residents"
    )