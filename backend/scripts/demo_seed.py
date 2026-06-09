import sys
import os
import random
from datetime import datetime, timedelta

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.site import Site
from app.models.building import Building
from app.models.apartment import Apartment
from app.models.due import Due
from app.models.complaint import Complaint
from app.models.announcement import Announcement
from app.core.security import hash_password

def seed_data():
    db = SessionLocal()
    print("Demo veri oluşturuluyor...")

    # Hedef Site
    admin_email = "nesli101@gmail.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    
    if not admin:
        print(f"Hata: {admin_email} admin kullanıcısı bulunamadı. Lütfen önce admin hesabını kontrol edin.")
        return
        
    site_id = admin.site_id
    if not site_id:
        print("Hata: Admin kullanıcısına ait bir site bulunamadı.")
        return
        
    print(f"Site ID {site_id} için veriler temizleniyor ve oluşturuluyor...")

    # Temizlik (önceki demo verilerini çakışmayı önlemek için siliyoruz, admini silmeden)
    demo_emails = [
        "ayse.yilmaz@test.com", "mehmet.kaya@test.com", "zeynep.demir@test.com",
        "ali.can@test.com", "fatma.sahin@test.com", "murat.arslan@test.com"
    ]
    
    # Admin hariç bu siteye ait tüm kullanıcıların ID'lerini bul
    user_ids = [u.id for u in db.query(User).filter(User.site_id == site_id, User.email != admin_email).all()]
    
    if user_ids:
        db.query(Complaint).filter(Complaint.user_id.in_(user_ids)).delete()
        db.query(Due).filter(Due.user_id.in_(user_ids)).delete()
        
    db.query(Announcement).filter(Announcement.site_id == site_id).delete()
    
    if user_ids:
        db.query(User).filter(User.id.in_(user_ids)).delete()
    
    # Bina ve daireleri temizle
    # Önce bu siteye ait tüm binaların ID'lerini al
    building_ids = [b.id for b in db.query(Building).filter(Building.site_id == site_id).all()]
    if building_ids:
        # Sonra bu binalara ait daireleri sil (kullanıcılar zaten silindi)
        # Sadece admin'in dairesi varsa diye adminin dairesini silmeyelim (büyük ihtimalle yok)
        db.query(Apartment).filter(Apartment.building_id.in_(building_ids)).delete()
        db.query(Building).filter(Building.site_id == site_id).delete()
        
    db.commit()
    print("Eski veriler temizlendi.")

    # 1. Binaları Oluştur
    buildings = [
        Building(site_id=site_id, name="A Blok", block_code="A", floor_count=3),
        Building(site_id=site_id, name="B Blok", block_code="B", floor_count=3)
    ]
    db.add_all(buildings)
    db.commit()
    
    for b in buildings:
        db.refresh(b)
        
    print("Binalar oluşturuldu.")

    # 2. Daireleri Oluştur (Her blokta 3 daire)
    apartments = []
    apartment_counter = 1
    
    for building in buildings:
        for floor in range(1, 4):
            apt = Apartment(
                building_id=building.id,
                apartment_number=str(apartment_counter),
                floor=floor,
                apt_type="3+1" if floor % 2 == 0 else "2+1"
            )
            apartments.append(apt)
            apartment_counter += 1
            
    db.add_all(apartments)
    db.commit()
    
    for a in apartments:
        db.refresh(a)
        
    print("Daireler oluşturuldu.")

    # 3. Kullanıcıları (Resident) Oluştur
    users_data = [
        {"name": "Ayşe Yılmaz", "email": "ayse.yilmaz@test.com", "phone": "05321112233"},
        {"name": "Mehmet Kaya", "email": "mehmet.kaya@test.com", "phone": "05332223344"},
        {"name": "Zeynep Demir", "email": "zeynep.demir@test.com", "phone": "05343334455"},
        {"name": "Ali Can", "email": "ali.can@test.com", "phone": "05354445566"},
        {"name": "Fatma Şahin", "email": "fatma.sahin@test.com", "phone": "05365556677"},
        {"name": "Murat Arslan", "email": "murat.arslan@test.com", "phone": "05376667788"}
    ]
    
    users = []
    # Her daireye bir kullanıcı atayalım
    for idx, u_data in enumerate(users_data):
        apt = apartments[idx % len(apartments)]
        user = User(
            full_name=u_data["name"],
            email=u_data["email"],
            password_hash=hash_password("123456"),
            role="resident",
            site_id=site_id,
            building_id=apt.building_id,
            apartment_id=apt.id,
            phone=u_data["phone"]
        )
        users.append(user)
        
    db.add_all(users)
    db.commit()
    
    for u in users:
        db.refresh(u)
        
    print("Sakinler (Residents) oluşturuldu.")

    # 4. Duyuruları Oluştur
    announcements = [
        Announcement(
            site_id=site_id,
            created_by=admin.id,
            title="Su Kesintisi Hakkında",
            content="Değerli sakinlerimiz, 10 Haziran Çarşamba günü saat 10:00 - 14:00 arasında sitemizde planlı su kesintisi yapılacaktır. Lütfen önleminizi alınız."
        ),
        Announcement(
            site_id=site_id,
            created_by=admin.id,
            title="Asansör Bakım Çalışması",
            content="B Blok asansörümüz 12 Haziran Cuma günü periyodik bakım nedeniyle yarım gün servis dışı kalacaktır. Anlayışınız için teşekkür ederiz."
        ),
        Announcement(
            site_id=site_id,
            created_by=admin.id,
            title="Bahçe Düzenleme Çalışması",
            content="Bahar aylarının gelmesiyle birlikte site bahçemizde çevre düzenlemesi ve çim biçme çalışmaları bu hafta sonu yapılacaktır."
        )
    ]
    db.add_all(announcements)
    db.commit()
    print("Duyurular oluşturuldu.")

    # 5. Aidatları Oluştur
    dues = []
    current_month = datetime.now().replace(day=1)
    previous_month = current_month - timedelta(days=1)
    previous_month = previous_month.replace(day=1)
    
    for user in users:
        # Geçen ay aidatı
        due1 = Due(
            user_id=user.id,
            site_id=site_id,
            amount=1500.0,
            due_date=previous_month,
            status=random.choice(["paid", "paid", "unpaid"]) # Büyük ihtimal ödenmiş
        )
        # Bu ay aidatı
        due2 = Due(
            user_id=user.id,
            site_id=site_id,
            amount=1500.0,
            due_date=current_month,
            status=random.choice(["paid", "unpaid", "unpaid"]) # Büyük ihtimal ödenmemiş
        )
        dues.extend([due1, due2])
        
    db.add_all(dues)
    db.commit()
    print("Aidatlar oluşturuldu.")

    # 6. Şikayetleri Oluştur
    complaint_data = [
        {"title": "Asansör çalışmıyor", "desc": "A Blok asansörü zemin katta takılı kaldı, kapıları kapanmıyor.", "cat": "Teknik", "prio": "Yüksek", "status": "pending"},
        {"title": "Otopark aydınlatması bozuk", "desc": "Misafir otopark kısmındaki 2 numaralı lamba yanıp sönüyor.", "cat": "Temizlik", "prio": "Düşük", "status": "resolved"},
        {"title": "Bahçe sulama problemi", "desc": "Çim sulama sistemi B blok tarafında suyu yola taşıyor.", "cat": "Diğer", "prio": "Orta", "status": "in_progress"},
        {"title": "Çöp toplama gecikiyor", "desc": "Akşam saatlerinde çöplerimiz zamanında alınmadı.", "cat": "Temizlik", "prio": "Orta", "status": "resolved"},
        {"title": "Gürültü şikayeti", "desc": "A Blok 3 numaralı daireden sürekli matkap sesi geliyor.", "cat": "Diğer", "prio": "Yüksek", "status": "pending"},
        {"title": "Giriş kapısı arızalı", "desc": "Site ana giriş yaya kapısının şifre paneli basmıyor.", "cat": "Teknik", "prio": "Yüksek", "status": "in_progress"},
    ]
    
    complaints = []
    for i, data in enumerate(complaint_data):
        user = random.choice(users)
        comp = Complaint(
            user_id=user.id,
            site_id=site_id,
            building_id=user.building_id,
            apartment_id=user.apartment_id,
            title=data["title"],
            description=data["desc"],
            category=data["cat"],
            priority=data["prio"],
            status=data["status"]
        )
        complaints.append(comp)
        
    db.add_all(complaints)
    db.commit()
    print("Şikayetler oluşturuldu.")
    
    print("\n--- İŞLEM BAŞARILI ---")
    print("Demo veriler eklendi. Frontend üzerinden admin hesabınızla (nesli101@gmail.com) giriş yapıp dashboard'u kontrol edebilirsiniz.")
    print("Örnek bir sakinin giriş bilgileri:")
    print("E-posta: ayse.yilmaz@test.com")
    print("Şifre: 123456")

if __name__ == "__main__":
    seed_data()
