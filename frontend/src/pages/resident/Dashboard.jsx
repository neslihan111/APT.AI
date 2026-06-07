import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { getMyComplaints } from '../../services/complaintService';
import { getMyDues } from '../../services/dueService';
import { getAnnouncements } from '../../services/announcementService';

export const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ pendingDuesCount: 0, pendingDuesSum: 0, openComplaintsCount: 0 });
    const [latestAnnouncement, setLatestAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [profileRes, complaints, dues, announcements] = await Promise.all([
                    api.get('/auth/me'),
                    getMyComplaints().catch(() => []),
                    getMyDues().catch(() => []),
                    getAnnouncements().catch(() => []),
                ]);

                setProfile(profileRes.data);
                
                const unpaid = dues.filter(d => d.status === 'unpaid');
                const unpaidSum = unpaid.reduce((sum, d) => sum + d.amount, 0);
                const openComplaints = complaints.filter(c => c.status === 'pending');

                setStats({
                    pendingDuesCount: unpaid.length,
                    pendingDuesSum: unpaidSum,
                    openComplaintsCount: openComplaints.length,
                });

                if (announcements && announcements.length > 0) {
                    setLatestAnnouncement(announcements[0]);
                }
            } catch {
                setError('Dashboard verileri yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Hoş Geldiniz, {profile?.full_name} 🚀</h1>

            {error && (
                <div style={{
                    backgroundColor: '#fee2e2', color: '#b91c1c',
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                }}>{error}</div>
            )}

            {/* Resident Info Block */}
            <Card className="mb-6" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>📍 İkamet Bilgileriniz</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>SİTE / APARTMAN</strong>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {profile?.site?.name || 'Kayıtlı Değil'}
                        </span>
                    </div>
                    <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>BİNA / BLOK</strong>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {profile?.building?.name || 'Kayıtlı Değil'}
                        </span>
                    </div>
                    <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>DAİRE NO</strong>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {profile?.apartment?.apartment_number || 'Kayıtlı Değil'}
                        </span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-6 mb-6">
                <Card title="Bekleyen Aidat">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                        {stats.pendingDuesSum.toLocaleString('tr-TR')} TL
                    </p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {stats.pendingDuesCount} adet bekleyen aidat borcu
                    </span>
                </Card>
                <Card title="Açık Şikayetlerim">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: stats.openComplaintsCount > 0 ? '#b91c1c' : 'inherit' }}>
                        {stats.openComplaintsCount}
                    </p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        İncelenmeyi bekleyen şikayetleriniz
                    </span>
                </Card>
                <Card title="Son Duyuru">
                    {latestAnnouncement ? (
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                                {latestAnnouncement.title}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {latestAnnouncement.content}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                            Henüz yayınlanmış bir duyuru bulunmuyor.
                        </p>
                    )}
                </Card>
            </div>
        </div>
    );
};
