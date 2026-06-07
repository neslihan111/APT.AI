from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base

# Import all models so SQLAlchemy can discover them
from app.models.user import User
from app.models.site import Site
from app.models.building import Building
from app.models.apartment import Apartment
from app.models.site_invite_code import SiteInviteCode
from app.models.complaint import Complaint
from app.models.announcement import Announcement
from app.models.due import Due

from app.routes.auth import router as auth_router
from app.routes.complaints import router as complaints_router
from app.routes.announcements import router as announcements_router
from app.routes.dues import router as dues_router
from app.routes.ai import router as ai_router
from app.routes.admin import router as admin_router

from contextlib import asynccontextmanager
from sqlalchemy import text
import sys

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-flight check for DB connection
    print("Veritabanı bağlantısı test ediliyor...")
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Veritabanı bağlantısı başarılı!")

        # Create tables (including new ones: buildings, apartments, site_invite_codes)
        Base.metadata.create_all(bind=engine)
        print("Tablolar başarıyla kontrol edildi/oluşturuldu.")

        # Check and add 'suggestion' column to 'complaints' if it's missing
        try:
            with engine.begin() as conn:
                conn.execute(text("""
                IF NOT EXISTS (
                    SELECT * FROM sys.columns 
                    WHERE object_id = OBJECT_ID('complaints') AND name = 'suggestion'
                )
                BEGIN
                    ALTER TABLE complaints ADD suggestion NVARCHAR(MAX) NULL;
                END
                """))
            print("Veritabanı 'suggestion' sütunu kontrol edildi/eklendi.")
        except Exception as column_err:
            print("Uyarı: 'suggestion' sütunu eklenirken hata oluştu (zaten mevcut olabilir):", column_err)
    except Exception as e:
        print("Kritik Hata: Veritabanına bağlanılamadı!", e)
        sys.exit(1)

    yield
    # Shutdown logic if any

app = FastAPI(
    title="APT.AI API",
    description="Multi-Site Apartman & Site Yönetim Sistemi",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(complaints_router)
app.include_router(announcements_router)
app.include_router(dues_router)
app.include_router(ai_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {"message": "APT.AI backend çalışıyor 🚀 (v3.0 — Multi-Site)"}

@app.get("/health")
def health():
    return {"status": "ok"}