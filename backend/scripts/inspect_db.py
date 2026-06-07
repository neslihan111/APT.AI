import sys
import os

# Proje kök dizinini Python path'e ekle
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy import text
from app.db.session import SessionLocal

db = SessionLocal()
try:
    print("--- USERS ---")
    result = db.execute(text("SELECT id, full_name, email, role, site_id FROM users"))
    for row in result:
        print(f"ID: {row[0]} | Name: {row[1]} | Email: {row[2]} | Role: {row[3]} | Site ID: {row[4]}")
        
    print("\n--- SITES ---")
    result = db.execute(text("SELECT id, name FROM sites"))
    for row in result:
        print(f"ID: {row[0]} | Name: {row[1]}")
        
    print("\n--- BUILDINGS ---")
    result = db.execute(text("SELECT id, name, block_code, site_id FROM buildings"))
    for row in result:
        print(f"ID: {row[0]} | Name: {row[1]} | Block: {row[2]} | Site ID: {row[3]}")
        
finally:
    db.close()
