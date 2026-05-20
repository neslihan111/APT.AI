"""
APT.AI — Yönetici (Admin) Oluşturma Script'i (v3.0 — Multi-Site)

Kullanım:
    python scripts/create_admin.py

Bu script, terminal üzerinden güvenli şekilde bir admin kullanıcı oluşturur
ve opsiyonel olarak site + bina + davet kodu da oluşturabilir.
"""

import sys
import os
import getpass

# Proje kök dizinini Python path'e ekle
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.db.session import SessionLocal, engine, Base
from app.models.user import User
from app.models.site import Site
from app.models.building import Building
from app.models.apartment import Apartment
from app.models.site_invite_code import SiteInviteCode
from app.core.security import hash_password


def create_admin():
    print("=" * 60)
    print("  APT.AI — Yönetici Oluşturma (Multi-Site v3.0)")
    print("=" * 60)
    print()

    # --- Admin bilgileri ---
    full_name = input("Ad Soyad: ").strip()
    if not full_name:
        print("❌ Ad Soyad boş olamaz!")
        return

    email = input("E-posta: ").strip()
    if not email or "@" not in email:
        print("❌ Geçerli bir e-posta adresi girin!")
        return

    phone = input("Telefon (opsiyonel): ").strip() or None

    password = getpass.getpass("Şifre: ")
    if len(password) < 6:
        print("❌ Şifre en az 6 karakter olmalıdır!")
        return

    password_confirm = getpass.getpass("Şifre (tekrar): ")
    if password != password_confirm:
        print("❌ Şifreler eşleşmiyor!")
        return

    # --- Site bilgileri ---
    print()
    print("-" * 40)
    create_site_input = input("Yeni bir site oluşturmak ister misiniz? (e/h): ").strip().lower()
    site_name = None
    site_address = None
    site_city = None
    buildings_to_create = []
    invite_code = None

    if create_site_input == "e":
        site_name = input("  Site Adı: ").strip()
        if not site_name:
            print("❌ Site adı boş olamaz!")
            return
        site_address = input("  Adres (opsiyonel): ").strip() or None
        site_city = input("  Şehir (opsiyonel): ").strip() or None

        # Bina ekleme
        print()
        add_buildings = input("  Bina/Blok eklemek ister misiniz? (e/h): ").strip().lower()
        if add_buildings == "e":
            while True:
                bname = input("    Bina Adı (boş bırakın = bitir): ").strip()
                if not bname:
                    break
                bcode = input(f"    Blok Kodu (ör: A, B, C) [{bname}]: ").strip() or None
                fcount_str = input("    Kat Sayısı (opsiyonel): ").strip()
                fcount = int(fcount_str) if fcount_str.isdigit() else None
                buildings_to_create.append({"name": bname, "block_code": bcode, "floor_count": fcount})

        # Davet kodu
        print()
        invite_code = input("  Davet Kodu (ör: GREENPARK2026, boş = otomatik atlat): ").strip().upper() or None

    # --- Tabloları oluştur ---
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # E-posta kontrolü
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"❌ Bu e-posta ({email}) zaten kayıtlı!")
            return

        # Admin oluştur
        admin_user = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            phone=phone,
            role="admin",
        )
        db.add(admin_user)
        db.flush()

        # Site oluştur
        if site_name:
            new_site = Site(
                name=site_name,
                address=site_address,
                city=site_city,
                current_admin_id=admin_user.id,
            )
            db.add(new_site)
            db.flush()
            admin_user.site_id = new_site.id

            # Binaları oluştur
            for b in buildings_to_create:
                new_building = Building(
                    site_id=new_site.id,
                    name=b["name"],
                    block_code=b["block_code"],
                    floor_count=b["floor_count"],
                )
                db.add(new_building)

            # Davet kodu oluştur
            if invite_code:
                new_invite = SiteInviteCode(
                    site_id=new_site.id,
                    code=invite_code,
                )
                db.add(new_invite)

        db.commit()
        db.refresh(admin_user)

        print()
        print("=" * 60)
        print("  ✅ Yönetici başarıyla oluşturuldu!")
        print("=" * 60)
        print(f"  ID       : {admin_user.id}")
        print(f"  Ad Soyad : {admin_user.full_name}")
        print(f"  E-posta  : {admin_user.email}")
        print(f"  Rol      : {admin_user.role}")
        if site_name:
            print(f"  Site     : {site_name}")
            if buildings_to_create:
                print(f"  Binalar  : {', '.join(b['name'] for b in buildings_to_create)}")
            if invite_code:
                print(f"  Davet Kodu: {invite_code}")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"❌ Hata oluştu: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
