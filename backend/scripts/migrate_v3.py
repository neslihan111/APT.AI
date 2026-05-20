"""
APT.AI v3.0 Migration Script
Adds missing columns to existing tables for multi-site architecture.
"""

import sys
import os
import io

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # type: ignore[union-attr]

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.db.session import engine
from sqlalchemy import text, inspect


def column_exists(inspector, table_name, column_name):
    """Check if a column exists in a table."""
    columns = [c["name"] for c in inspector.get_columns(table_name)]
    return column_name in columns


def run_migration():
    print("=" * 60)
    print("  APT.AI v3.0 -- Veritabani Migration")
    print("=" * 60)

    inspector = inspect(engine)

    # Define all ALTER TABLE operations needed
    migrations = []

    # --- USERS table ---
    if not column_exists(inspector, "users", "phone"):
        migrations.append(("users", "phone", "ALTER TABLE users ADD phone VARCHAR(20) NULL"))
    if not column_exists(inspector, "users", "site_id"):
        migrations.append(("users", "site_id", "ALTER TABLE users ADD site_id INTEGER NULL"))
    if not column_exists(inspector, "users", "building_id"):
        migrations.append(("users", "building_id", "ALTER TABLE users ADD building_id INTEGER NULL"))
    if not column_exists(inspector, "users", "apartment_id"):
        migrations.append(("users", "apartment_id", "ALTER TABLE users ADD apartment_id INTEGER NULL"))

    # --- COMPLAINTS table ---
    if not column_exists(inspector, "complaints", "site_id"):
        migrations.append(("complaints", "site_id", "ALTER TABLE complaints ADD site_id INTEGER NULL"))
    if not column_exists(inspector, "complaints", "building_id"):
        migrations.append(("complaints", "building_id", "ALTER TABLE complaints ADD building_id INTEGER NULL"))
    if not column_exists(inspector, "complaints", "apartment_id"):
        migrations.append(("complaints", "apartment_id", "ALTER TABLE complaints ADD apartment_id INTEGER NULL"))

    # --- ANNOUNCEMENTS table ---
    if not column_exists(inspector, "announcements", "site_id"):
        migrations.append(("announcements", "site_id", "ALTER TABLE announcements ADD site_id INTEGER NULL"))

    # --- DUES table ---
    if not column_exists(inspector, "dues", "site_id"):
        migrations.append(("dues", "site_id", "ALTER TABLE dues ADD site_id INTEGER NULL"))

    if not migrations:
        print("\n  [OK] Tum sutunlar zaten mevcut. Migration gerekmiyor.")
        return

    print(f"\n  {len(migrations)} migration islemi bulundu:\n")

    with engine.begin() as conn:
        for table, col, sql in migrations:
            try:
                print(f"  --> {table}.{col} ekleniyor...")
                conn.execute(text(sql))
                print(f"      [OK] Basarili")
            except Exception as e:
                print(f"      [HATA] {e}")

    # Now add foreign key constraints
    print("\n  Foreign key'ler ekleniyor...\n")

    fk_operations = [
        ("FK_users_site_id", "ALTER TABLE users ADD CONSTRAINT FK_users_site_id FOREIGN KEY (site_id) REFERENCES sites(id)"),
        ("FK_users_building_id", "ALTER TABLE users ADD CONSTRAINT FK_users_building_id FOREIGN KEY (building_id) REFERENCES buildings(id)"),
        ("FK_users_apartment_id", "ALTER TABLE users ADD CONSTRAINT FK_users_apartment_id FOREIGN KEY (apartment_id) REFERENCES apartments(id)"),
        ("FK_complaints_site_id", "ALTER TABLE complaints ADD CONSTRAINT FK_complaints_site_id FOREIGN KEY (site_id) REFERENCES sites(id)"),
        ("FK_complaints_building_id", "ALTER TABLE complaints ADD CONSTRAINT FK_complaints_building_id FOREIGN KEY (building_id) REFERENCES buildings(id)"),
        ("FK_complaints_apartment_id", "ALTER TABLE complaints ADD CONSTRAINT FK_complaints_apartment_id FOREIGN KEY (apartment_id) REFERENCES apartments(id)"),
        ("FK_announcements_site_id", "ALTER TABLE announcements ADD CONSTRAINT FK_announcements_site_id FOREIGN KEY (site_id) REFERENCES sites(id)"),
        ("FK_dues_site_id", "ALTER TABLE dues ADD CONSTRAINT FK_dues_site_id FOREIGN KEY (site_id) REFERENCES sites(id)"),
    ]

    for fk_name, sql in fk_operations:
        try:
            with engine.begin() as conn:
                conn.execute(text(sql))
                print(f"  --> {fk_name} [OK]")
        except Exception as e:
            err_msg = str(e)
            if "already" in err_msg.lower() or "duplicate" in err_msg.lower():
                print(f"  --> {fk_name} [ZATEN MEVCUT]")
            else:
                print(f"  --> {fk_name} [HATA] {err_msg[:100]}")

    print("\n" + "=" * 60)
    print("  [OK] Migration tamamlandi!")
    print("=" * 60)

    # Verify final state
    inspector2 = inspect(engine)
    print("\n  Son durum:")
    for table in ["users", "complaints", "announcements", "dues"]:
        cols = [c["name"] for c in inspector2.get_columns(table)]
        print(f"    {table}: {cols}")


if __name__ == "__main__":
    run_migration()
