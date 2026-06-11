import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [siteInfo, setSiteInfo] = useState(null);
    const [pendingApps, setPendingApps] = useState([]);
    const [stats, setStats] = useState({
        totalResidents: 0,
        totalBuildings: 0,
        totalApartments: 0,
        totalComplaints: 0,
        pendingComplaints: 0,
        totalDues: 0,
    });
    const [insights, setInsights] = useState({
        summary: '',
        repeating_issues: [],
        suggestions: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    const handleKeyDown = (e, path) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(path);
        }
    };

    const loadPendingApplications = async () => {
        try {
            const res = await api.get('/admin/pending-applications');
            setPendingApps(res.data);
        } catch (err) {
            console.error("Pending applications loaded failed:", err);
        }
    };

    const handleApproveApp = async (appId) => {
        try {
            await api.post(`/admin/approve-application/${appId}`);
            loadPendingApplications();
        } catch (err) {
            alert("Başvuru onaylanamadı: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleRejectApp = async (appId) => {
        if (!window.confirm("Bu başvuruyu reddetmek istediğinize emin misiniz?")) return;
        try {
            await api.post(`/admin/reject-application/${appId}`);
            loadPendingApplications();
        } catch (err) {
            alert("Başvuru reddedilemedi: " + (err.response?.data?.detail || err.message));
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            setError('');
            let siteLoaded = false;
            let statsLoaded = false;

            try {
                const siteRes = await api.get('/admin/site');
                setSiteInfo(siteRes.data);
                siteLoaded = true;
            } catch (err) {
                console.error("Site bilgisi yüklenemedi:", err);
            }

            try {
                const statsRes = await api.get('/admin/stats');
                const s = statsRes.data;
                setStats({
                    totalResidents: s.total_residents ?? 0,
                    totalBuildings: s.total_buildings ?? 0,
                    totalApartments: s.total_apartments ?? 0,
                    totalComplaints: s.total_complaints ?? 0,
                    pendingComplaints: s.pending_complaints ?? 0,
                    totalDues: s.total_dues ?? 0,
                });
                statsLoaded = true;
            } catch (err) {
                console.error("Stats yüklenemedi:", err);
            }

            try {
                const insightsRes = await api.get('/ai/dashboard-insights');
                setInsights(insightsRes.data);
            } catch (err) {
                console.error("AI insights yüklenemedi:", err);
                setInsights({
                    summary: 'AI analiz raporu yüklenemedi.',
                    repeating_issues: [],
                    suggestions: [],
                });
            }

            await loadPendingApplications();

            if (!siteLoaded && !statsLoaded) {
                setError('Dashboard verileri yüklenemedi');
            }
            setLoading(false);
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

            {/* Pending Admin Applications Banner */}
            {pendingApps.length > 0 && (
                <Card title={`🔔 Bekleyen Yönetici Başvuruları (${pendingApps.length})`} className="mb-6" style={{ borderColor: 'var(--warning)', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pendingApps.map((app) => (
                            <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fffbeb', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{app.full_name} ({app.email})</p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        🏢 {app.site_name} - {app.city}, {app.address}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleApproveApp(app.id)} style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Onayla</button>
                                    <button onClick={() => handleRejectApp(app.id)} style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Reddet</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <Card 
                    title="Toplam Sakin" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/users')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/users')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalResidents}</p>
                </Card>
                <Card 
                    title="Toplam Bina" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/buildings')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/buildings')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalBuildings}</p>
                </Card>
                <Card 
                    title="Toplam Daire" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/buildings')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/buildings')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalApartments}</p>
                </Card>
                <Card 
                    title="Toplam Şikayet" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/complaints')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/complaints')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalComplaints}</p>
                </Card>
                <Card 
                    title="Bekleyen Şikayet" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/complaints?status=pending')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/complaints?status=pending')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: stats.pendingComplaints > 0 ? '#b91c1c' : 'inherit' }}>
                        {stats.pendingComplaints}
                    </p>
                </Card>
                <Card 
                    title="Aidat Sayısı" 
                    className="interactive-card" 
                    onClick={() => handleCardClick('/admin/dues')}
                    onKeyDown={(e) => handleKeyDown(e, '/admin/dues')}
                    role="button"
                    tabIndex={0}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalDues}</p>
                </Card>
            </div>

            <h2 className="mb-4">AI Haftalık Analiz ve Çözüm Önerileri</h2>
            <Card 
                className="interactive-card mb-6" 
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', cursor: 'pointer' }}
                onClick={() => handleCardClick('/admin/ai-insights')}
                onKeyDown={(e) => handleKeyDown(e, '/admin/ai-insights')}
                role="button"
                tabIndex={0}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>🤖</div>
                    <div style={{ flex: 1 }}>
                        <h3 className="mb-2" style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>Yönetici AI Raporu</h3>
                        <p style={{ color: '#15803d', fontWeight: 500, marginBottom: '1rem', lineHeight: '1.5' }}>
                            {insights.summary || 'Şikayet verisi bulunmadığından haftalık AI analiz raporu oluşturulamadı.'}
                        </p>
                        
                        {insights.repeating_issues && insights.repeating_issues.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '600' }}>🔄 Tekrar Eden Sorunlar:</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#15803d', fontSize: '0.85rem' }}>
                                    {insights.repeating_issues.map((issue, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {insights.suggestions && insights.suggestions.length > 0 && (
                            <div>
                                <h4 style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '600' }}>💡 Çözüm Önerileri:</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#15803d', fontSize: '0.85rem' }}>
                                    {insights.suggestions.map((suggestion, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
