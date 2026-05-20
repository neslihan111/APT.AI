import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        siteCode: '', buildingId: '', apartmentId: '',
    });
    const [siteInfo, setSiteInfo] = useState(null);
    const [buildings, setBuildings] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeValidating, setCodeValidating] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!formData.name.trim()) { setError('Ad Soyad alanı zorunludur'); return false; }
        if (!formData.email.trim()) { setError('E-posta alanı zorunludur'); return false; }
        if (formData.password.length < 6) { setError('Şifre en az 6 karakter olmalıdır'); return false; }
        return true;
    };

    const handleValidateCode = async () => {
        const code = formData.siteCode.trim();
        if (!code) { setError('Lütfen bir site kodu girin'); return; }
        setCodeValidating(true);
        setError('');
        setSiteInfo(null);
        setBuildings([]);
        setApartments([]);
        setFormData(prev => ({ ...prev, buildingId: '', apartmentId: '' }));

        try {
            const res = await api.post('/auth/validate-invite-code', { code });
            setSiteInfo(res.data);

            // Load buildings for this site
            if (res.data.site_id) {
                const bRes = await api.get(`/auth/site/${res.data.site_id}/buildings`);
                setBuildings(bRes.data || []);
            }
        } catch (err) {
            const msg = err.response?.data?.detail || 'Geçersiz site kodu';
            setError(msg);
        } finally {
            setCodeValidating(false);
        }
    };

    const handleBuildingChange = async (buildingId) => {
        setFormData(prev => ({ ...prev, buildingId, apartmentId: '' }));
        setApartments([]);
        if (buildingId) {
            try {
                const res = await api.get(`/auth/building/${buildingId}/apartments`);
                setApartments(res.data || []);
            } catch { /* ignore */ }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register(formData);
            setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            const message = error.response?.data?.detail || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{
                    backgroundColor: '#fee2e2', color: '#b91c1c',
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem',
                    fontSize: '0.875rem', fontWeight: 500
                }}>{error}</div>
            )}
            {success && (
                <div style={{
                    backgroundColor: '#dcfce7', color: '#15803d',
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem',
                    fontSize: '0.875rem', fontWeight: 500
                }}>{success}</div>
            )}

            <Input label="Ad Soyad" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} required />
            <Input label="E-posta" type="email" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required />
            <Input label="Şifre" type="password" value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} required />
            <Input label="Telefon (Opsiyonel)" value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})} />

            {/* Site Code Section */}
            <div style={{
                backgroundColor: '#f8fafc', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1rem', marginBottom: '1rem',
            }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    🏢 Site Kodu (Opsiyonel)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="input-field"
                        placeholder="Örn: GREENPARK2026"
                        value={formData.siteCode}
                        onChange={e => setFormData({...formData, siteCode: e.target.value.toUpperCase()})}
                        style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                    <Button type="button" className="btn-outline" onClick={handleValidateCode}
                        disabled={codeValidating} style={{ whiteSpace: 'nowrap' }}>
                        {codeValidating ? '...' : 'Doğrula'}
                    </Button>
                </div>

                {siteInfo && (
                    <div style={{
                        marginTop: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d',
                        padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                    }}>
                        ✅ Site: <strong>{siteInfo.site_name}</strong>
                    </div>
                )}

                {/* Building Selection */}
                {siteInfo && buildings.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.25rem' }}>
                            Blok / Bina
                        </label>
                        <select className="input-field" value={formData.buildingId}
                            onChange={e => handleBuildingChange(e.target.value)}
                            style={{ width: '100%' }}>
                            <option value="">— Seçiniz —</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name}{b.block_code ? ` (${b.block_code})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Apartment Selection */}
                {formData.buildingId && apartments.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.25rem' }}>
                            Daire
                        </label>
                        <select className="input-field" value={formData.apartmentId}
                            onChange={e => setFormData({...formData, apartmentId: e.target.value})}
                            style={{ width: '100%' }}>
                            <option value="">— Seçiniz —</option>
                            {apartments.map(a => (
                                <option key={a.id} value={a.id}>
                                    Daire {a.apartment_number}{a.floor ? ` (Kat ${a.floor})` : ''}{a.apt_type ? ` — ${a.apt_type}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{
                backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            }}>
                <span style={{ fontSize: '1rem', lineHeight: '1.4' }}>ℹ️</span>
                <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, lineHeight: '1.4' }}>
                    Yönetici hesabı yalnızca sistem yöneticisi tarafından oluşturulabilir.
                    Site kodu, yöneticinizden temin edilir.
                </p>
            </div>

            <Button type="submit" className="mt-4 w-full" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
            <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Giriş Yap</Link>
            </p>
        </form>
    );
};
