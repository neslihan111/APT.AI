import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [siteInfo, setSiteInfo] = useState(null);
    const [stats, setStats] = useState({
        totalComplaints: 0, openComplaints: 0,
        totalResidents: 0, totalBuildings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const siteRes = await api.get('/admin/site');
                setSiteInfo(siteRes.data);

                const [usersRes, complaintsRes] = await Promise.all([
                    api.get('/auth/users').catch(() => ({ data: [] })),
                    api.get('/complaints').catch(() => ({ data: [] })),
                ]);

                const users = usersRes.data || [];
                const complaints = complaintsRes.data || [];

                setStats({
                    totalComplaints: complaints.length,
                    openComplaints: complaints.filter(c => c.status === 'pending' || c.status === 'open').length,
                    totalResidents: users.filter(u => u.role === 'resident').length,
                    totalBuildings: siteRes.data?.building_count || 0,
                });
            } catch (err) {
                setError('Dashboard verisi yüklenemedi');
                console.error('Dashboard verisi yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Yönetici Paneli</h1>

            {error && (
                <div style={{
                    backgroundColor: '#fee2e2', color: '#b91c1c',
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem',
                    fontSize: '0.875rem', fontWeight: 500
                }}>{error}</div>
            )}

            {/* Site & Admin Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <Card style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>🏢</div>
                        <div>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Site Bilgisi</h3>
                            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                {siteInfo?.name || 'Henüz site atanmamış'}
                            </p>
                            {siteInfo?.city && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                    🌆 {siteInfo.city}
                                </p>
                            )}
                            {siteInfo?.address && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                    📍 {siteInfo.address}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--success)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>👤</div>
                        <div>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Mevcut Yönetici</h3>
                            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                {siteInfo?.admin_name || user?.name}
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                ✉️ {siteInfo?.admin_email || user?.email}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <Card title="Toplam Şikayet">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalComplaints}</p>
                </Card>
                <Card title="Açık Şikayetler">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.openComplaints > 0 ? 'var(--warning)' : 'inherit' }}>
                        {stats.openComplaints}
                    </p>
                </Card>
                <Card title="Toplam Sakin">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalResidents}</p>
                </Card>
                <Card title="Bina / Blok">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalBuildings}</p>
                </Card>
            </div>

            <h2 className="mb-4">AI Hızlı Özet</h2>
            <Card className="mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="flex items-start gap-4">
                    <div style={{ fontSize: '2rem' }}>🤖</div>
                    <div>
                        <h3 className="mb-2" style={{ color: '#166534' }}>Haftalık Durum Raporu</h3>
                        <p style={{ color: '#15803d' }}>
                            Bu hafta otopark ile ilgili şikayetlerde artış gözlemleniyor.
                            Genel aidat ödeme oranı %85.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
