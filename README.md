# 🏢 APT-AI — Akıllı Site Yönetim Sistemi

Apartman ve site yönetimi için yapay zeka destekli yönetim platformu.

---

## 📁 Proje Yapısı

```
APT-AI/
├── .vscode/              # VS Code yapılandırması
│   ├── settings.json     # Python, terminal profilleri
│   ├── tasks.json        # Otomatik görevler (Run Backend/Frontend)
│   └── launch.json       # Debug yapılandırması
├── backend/              # FastAPI Backend (Python)
│   ├── .env              # Ortam değişkenleri
│   ├── .venv/            # Python sanal ortam
│   ├── app/              # Uygulama kodu
│   ├── scripts/          # Veritabanı scriptleri
│   └── requirements.txt  # Python bağımlılıkları
├── frontend/             # React Frontend (Vite)
│   ├── src/              # Kaynak kodu
│   ├── public/           # Statik dosyalar
│   ├── package.json      # Node bağımlılıkları
│   └── vite.config.js    # Vite yapılandırması
├── start-backend.ps1     # Backend başlatma scripti
├── start-frontend.ps1    # Frontend başlatma scripti
├── start-all.ps1         # Her ikisini birden başlat
└── README.md             # Bu dosya
```

> ⚠️ **ÖNEMLİ:** `backend/` ve `frontend/` klasörleri proje **kökünde** yan yanadır.
> Backend içindeyken `cd frontend` yazmak **HATALIDIR** — çünkü `backend/frontend/` diye bir klasör yoktur.

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

- **Python 3.11+** (backend için)
- **Node.js 18+** ve **npm** (frontend için)
- **SQL Server** veritabanı bağlantısı (`.env` dosyasında tanımlı)

### Yöntem 1: Tek Komutla Başlatma (Önerilen)

Proje kökünden:

```powershell
.\start-all.ps1
```

Bu komut backend ve frontend'i **ayrı terminal pencerelerinde** otomatik olarak başlatır.

### Yöntem 2: Ayrı Terminallerde Başlatma

```powershell
# Terminal 1 - Proje kökünden:
.\start-backend.ps1

# Terminal 2 - Proje kökünden:
.\start-frontend.ps1
```

### Yöntem 3: Manuel Başlatma

**Terminal 1 — Backend:**

```powershell
cd C:\Users\nesli\APT-AI\backend
.\.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**Terminal 2 — Frontend:**

```powershell
cd C:\Users\nesli\APT-AI\frontend
npm run dev
```

### Yöntem 4: VS Code Tasks (En Pratik)

1. `Ctrl+Shift+P` → "Tasks: Run Task" yazın
2. Seçenekler:
   - **▶ Run Backend** — Sadece backend başlatır
   - **▶ Run Frontend** — Sadece frontend başlatır
   - **🚀 Run Full Stack** — İkisini birden paralel başlatır

---

## 🖥️ VS Code Terminal Profilleri

Terminal açarken `+` butonunun yanındaki ok'a tıklayın:

| Profil | Açıklama |
|---|---|
| **Backend Terminal** | `backend/` dizininde açılır, `.venv` otomatik aktif olur |
| **Frontend Terminal** | `frontend/` dizininde açılır, `package.json` kontrolü yapar |
| **PowerShell** | Proje kökünde standart terminal |

---

## 🌐 Sunucu Adresleri

| Servis | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (FastAPI) | http://127.0.0.1:8000 |
| API Docs (Swagger) | http://127.0.0.1:8000/docs |
| API Docs (ReDoc) | http://127.0.0.1:8000/redoc |

---

## ⚠️ Sık Yapılan Hatalar

### ❌ `cd frontend` hatası

```
cd : Cannot find path 'C:\...\backend\frontend' because it does not exist.
```

**Sebep:** Backend terminali içindeyken `cd frontend` yazmak.

**Çözüm:**
```powershell
# Önce proje köküne dön
cd ..
cd frontend

# veya doğrudan tam path kullan
cd C:\Users\nesli\APT-AI\frontend
```

**En iyi çözüm:** VS Code'da ayrı terminal profili kullanın (yukarıya bakın).

### ❌ `ENOENT package.json not found`

```
npm error enoent Could not read package.json
```

**Sebep:** `npm` komutunu yanlış dizinde çalıştırmak.

**Çözüm:** Önce `frontend/` dizinine geçtiğinizden emin olun:
```powershell
cd C:\Users\nesli\APT-AI\frontend
npm run dev
```

### ❌ Virtual environment aktif değil

```
ModuleNotFoundError: No module named 'fastapi'
```

**Çözüm:**
```powershell
cd C:\Users\nesli\APT-AI\backend
.\.venv\Scripts\activate
```

---

## 🔧 Geliştirme İpuçları

1. **Her zaman doğru dizinde olduğunuzu kontrol edin** — `pwd` komutunu kullanın
2. **VS Code terminal profillerini kullanın** — Yanlış dizin sorununu kökten çözer
3. **`start-all.ps1` kullanın** — Her şeyi doğru yapılandırmayla başlatır
4. **Backend değişikliklerinde** sunucu otomatik yeniden başlar (`--reload` aktif)
5. **Frontend değişikliklerinde** Vite HMR sayesinde sayfa otomatik güncellenir

---

## 📦 Bağımlılık Yönetimi

### Backend (Python)

```powershell
cd backend
.\.venv\Scripts\activate
pip install -r requirements.txt       # Tüm paketleri yükle
pip install <paket-adı>               # Yeni paket ekle
pip freeze > requirements.txt         # Paket listesini güncelle
```

### Frontend (Node.js)

```powershell
cd frontend
npm install                           # Tüm paketleri yükle
npm install <paket-adı>               # Yeni paket ekle
npm run build                         # Production build
npm run lint                          # ESLint kontrolü
```

---

## 🏗️ Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy |
| **Veritabanı** | Microsoft SQL Server |
| **AI** | Google Gemini API |
| **Stil** | Vanilla CSS |
