import { useEffect, useState } from 'react';
import { getAnnouncements } from '../../services/announcementService';
import { Card } from '../../components/ui/Card';

export const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch {
            setError('Duyurular yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Duyurular</h1>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

            {announcements.length === 0 ? (
                <Card>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz yayınlanmış bir duyuru bulunmuyor.
                    </p>
                </Card>
            ) : (
                <div className="flex flex-col gap-4">
                    {announcements.map(a => (
                        <Card key={a.id} title={a.title}>
                            <p className="mb-2 text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                📅 {a.created_at ? new Date(a.created_at).toLocaleString('tr-TR') : '-'}
                            </p>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{a.content}</p>
                            {a.summary && (
                                <div className="mt-4 p-3" style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 500, margin: 0 }}>✨ AI Özeti: {a.summary}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
