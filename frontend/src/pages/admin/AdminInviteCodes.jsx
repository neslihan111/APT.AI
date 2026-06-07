import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { api } from '../../services/api';

export const AdminInviteCodes = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ code: '', expiresAt: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { loadCodes(); }, []);

    const loadCodes = async () => {
        try {
            const res = await api.get('/admin/invite-codes');
            setCodes(res.data);
        } catch {
            setError('Davet kodları yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.code.trim()) { setError('Davet kodu zorunludur'); return; }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            await api.post('/admin/invite-codes', {
                code: formData.code.toUpperCase(),
                expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
            });
            setSuccess('Davet kodu oluşturuldu');
            setFormData({ code: '', expiresAt: '' });
            setShowForm(false);
            loadCodes();
        } catch (err) {
            setError(err.response?.data?.detail || 'Kod oluşturulamadı');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await api.put(`/admin/invite-codes/${id}/deactivate`);
            setSuccess('Davet kodu devre dışı bırakıldı');
            loadCodes();
        } catch (err) {
            setError(err.response?.data?.detail || 'İşlem başarısız');
        }
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        setFormData({ ...formData, code });
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setSuccess(`"${code}" kodu panoya kopyalandı!`);
        setTimeout(() => setSuccess(''), 3000);
    };

    const columns = [
        { header: 'Kod', render: (r) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem', letterSpacing: '1px' }}>
                    {r.code}
                </span>
                <Button className="btn-outline" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', border: '1px solid #cbd5e1' }}
                    onClick={() => handleCopy(r.code)}>
                    📋 Kopyala
                </Button>
            </div>
        )},
        { header: 'Durum', render: (r) => {
            const isExpired = r.expires_at && new Date(r.expires_at) < new Date();
            if (isExpired) return <span style={{ color: '#b91c1c', fontWeight: 500 }}>⏳ Süresi Doldu</span>;
            return r.is_active ?
                <span style={{ color: '#15803d', fontWeight: 500 }}>✅ Aktif</span> :
                <span style={{ color: '#b91c1c', fontWeight: 500 }}>❌ Pasif</span>;
        }},
        { header: 'Oluşturulma', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('tr-TR') : '-' },
        { header: 'Son Kullanma', render: (r) => r.expires_at ? new Date(r.expires_at).toLocaleString('tr-TR') : 'Süresiz' },
        {
            header: 'İşlem', render: (r) => r.is_active && (!r.expires_at || new Date(r.expires_at) >= new Date()) ? (
                <Button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => handleDeactivate(r.id)}>
                    Devre Dışı Bırak
                </Button>
            ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
        },
    ];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Davet Kodları</h1>
                <Button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'İptal' : '+ Yeni Kod'}
                </Button>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

            {/* Info */}
            <div style={{
                backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px',
                padding: '0.75rem 1rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            }}>
                <span style={{ fontSize: '1rem' }}>ℹ️</span>
                <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>
                    Davet kodlarını site sakinlerine paylaşın. Kayıt olurken bu kodu giren kullanıcılar
                    otomatik olarak sitenize bağlanır.
                </p>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <h3 style={{ marginBottom: '1rem' }}>Yeni Davet Kodu</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <Input label="Davet Kodu *" placeholder="Ör: GREENPARK2026"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
                                </div>
                                <Button type="button" className="btn-outline" onClick={generateRandomCode}
                                    style={{ marginBottom: '1rem', whiteSpace: 'nowrap' }}>
                                    🎲 Rastgele
                                </Button>
                            </div>
                            <div>
                                <Input label="Son Kullanma Tarihi (Opsiyonel)" type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} />
                            </div>
                        </div>
                        <Button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
                        </Button>
                    </form>
                </Card>
            )}

            <Card>
                {codes.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz davet kodu oluşturulmamış.
                    </p>
                ) : (
                    <Table columns={columns} data={codes} />
                )}
            </Card>
        </div>
    );
};
