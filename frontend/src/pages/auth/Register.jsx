import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register = () => {
    const [registerType, setRegisterType] = useState('resident'); // 'resident' or 'manager'
    
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        siteCode: '', buildingId: '', apartmentId: '',
        siteName: '', city: '', address: ''
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
        
        if (registerType === 'resident') {
            if (!formData.siteCode.trim()) { setError('Lütfen bir site kodu girin ve doğrulayın'); return false; }
            if (!siteInfo) { setError('Lütfen kayıt olmadan önce site kodunuzu doğrulayın'); return false; }
        } else {
            if (!formData.siteName.trim()) { setError('Site / Apartman Adı zorunludur'); return false; }
            if (!formData.city.trim()) { setError('Şehir alanı zorunludur'); return false; }
            if (!formData.address.trim()) { setError('Adres alanı zorunludur'); return false; }
        }
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
            await register({ ...formData, registerType });
            
            if (registerType === 'manager') {
                setSuccess('Yönetici başvurunuz alındı. Hesabınız sistem yöneticisi tarafından onaylandıktan sonra panele erişebilirsiniz.');
            } else {
                setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error) {
            const message = error.response?.data?.detail || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>APT.AI</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Apartman & Site Yönetim Sistemi</p>
            </div>

            {/* Type Selection Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    type="button"
                    onClick={() => { setRegisterType('resident'); setError(''); setSuccess(''); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.2s', cursor: 'pointer',
                        border: registerType === 'resident' ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: registerType === 'resident' ? '#eff6ff' : 'white',
                        color: registerType === 'resident' ? 'var(--primary)' : 'var(--text-light)',
                    }}
                >
                    🏠 Apartman Sakiniyim
                </button>
                <button
                    type="button"
                    onClick={() => { setRegisterType('manager'); setError(''); setSuccess(''); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.2s', cursor: 'pointer',
                        border: registerType === 'manager' ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: registerType === 'manager' ? '#eff6ff' : 'white',
                        color: registerType === 'manager' ? 'var(--primary)' : 'var(--text-light)',
                    }}
                >
                    🏢 Site Yöneticisiyim
                </button>
            </div>

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

            {/* Resident Flow */}
            {registerType === 'resident' && (
                <div style={{
                    backgroundColor: '#f8fafc', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '1rem', marginBottom: '1rem',
                }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                        🔑 Site Davet Kodu
                    </label>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        Site kodunuzu yöneticinizden alabilirsiniz.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            className="input-field"
                            placeholder="Örn: APT2026"
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
                            ✅ Site doğrulandı: <strong>{siteInfo.site_name}</strong>
                        </div>
                    )}

                    {siteInfo && buildings.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.25rem' }}>Blok / Bina</label>
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

                    {formData.buildingId && apartments.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.25rem' }}>Daire</label>
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
            )}

            {/* Manager Flow */}
            {registerType === 'manager' && (
                <div style={{
                    backgroundColor: '#f8fafc', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '1rem', marginBottom: '1rem',
                }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                        Site / Apartman Bilgileri
                    </h3>
                    <Input label="Site / Apartman Adı" value={formData.siteName}
                        onChange={e => setFormData({...formData, siteName: e.target.value})} />
                    <Input label="Şehir" value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})} />
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>Adres</label>
                        <textarea 
                            className="input-field" 
                            rows="2"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>
                </div>
            )}

            <Button type="submit" className="mt-4 w-full" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'İşleniyor...' : (registerType === 'resident' ? 'Kayıt Ol' : 'Başvuru Yap')}
            </Button>
            
            <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Giriş Yap</Link>
            </p>
        </form>
    );
};
