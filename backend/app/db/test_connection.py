from sqlalchemy import text
from app.db.session import engine

def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Database bağlantısı başarılı:", result.scalar())
    except Exception as e:
        print("Database bağlantısı başarısız oldu!")
        error_msg = str(e)
        if "Login failed" in error_msg:
            print("HATA TÜRÜ: Login Failed (Kullanıcı adı/şifre veya yetki hatası)")
        elif "Server is not found or not accessible" in error_msg or "Cannot open database" in error_msg:
            print("HATA TÜRÜ: Server veya Database bulunamadı (Instance adı veya DB adı yanlış olabilir)")
        else:
            print("HATA TÜRÜ: Bilinmeyen Hata")
        print("Detay:", error_msg)

if __name__ == "__main__":
    test_connection()