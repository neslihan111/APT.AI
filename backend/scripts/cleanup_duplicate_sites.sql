-- ===============================================================================
-- APT.AI - Duplicate Site Cleanup Script
-- ===============================================================================
--
-- Bu script, aynı admin'e ait birden fazla site kaydı oluşturulmuş (duplicate) 
-- durumlarını tespit etmek ve temizlemek için hazırlanmıştır.
-- Otomatik silme işlemi yapmaz, sadece örnek sorguları içerir.
--
-- DİKKAT: İşlem yapmadan önce veritabanı yedeği almanız önerilir!
-- ===============================================================================

-- 1. Hangi adminlerin birden fazla sitesi olduğunu bulmak için:
SELECT current_admin_id, COUNT(*) as site_count
FROM sites
GROUP BY current_admin_id
HAVING COUNT(*) > 1;

-- 2. Bu adminlere ait duplicate sitelerin detaylarını görmek için:
SELECT id, name, current_admin_id, created_at
FROM sites
WHERE current_admin_id IN (
    SELECT current_admin_id
    FROM sites
    GROUP BY current_admin_id
    HAVING COUNT(*) > 1
)
ORDER BY current_admin_id, id;

-- 3. (OPSİYONEL - SİLME İŞLEMİ) 
-- Her admin için yalnızca en son oluşturulan (id'si en büyük olan) siteyi tutup,
-- eski (test) duplicate siteleri SİLMEK isterseniz aşağıdaki sorguyu kullanabilirsiniz.
-- Not: Silmeden önce bu sitelere bağlı bina vb. kayıtların olmadığından emin olun.

/*
DELETE FROM sites
WHERE id NOT IN (
    -- Her admin için en yüksek ID'ye sahip siteyi seçiyoruz (en güncel olan)
    SELECT MAX(id)
    FROM sites
    GROUP BY current_admin_id
)
AND current_admin_id IS NOT NULL;
*/

-- 4. Kullanıcıların güncel site_id'lerini düzeltmek (Senkronizasyon)
-- Silinen sitelerdeki veya yanlış site_id'ye sahip admin kullanıcıların site_id'lerini
-- tutulan tek geçerli siteye eşitlemek için (eğer null veya silinmiş bir id ise):

/*
UPDATE users
SET site_id = s.id
FROM users u
INNER JOIN sites s ON s.current_admin_id = u.id
WHERE u.role = 'admin' 
  AND (u.site_id IS NULL OR u.site_id <> s.id);
*/
